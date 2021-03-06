import { IO, Server, SocketService, Socket as SocketParam } from "@tsed/socketio";
import { Socket } from "socket.io"
import { Inject } from "@tsed/di";
import { $log } from "@tsed/logger";
import User from "../../business-logic/entity/User";
import { ActiveEvents } from "./events/loadEvents";
import { ChatDao, UserDao } from "../../data-access/da.interfaces";
import MongoChatDao from "../../data-access/mongo/MongoChatDao";
import MongoUserDao from "../../data-access/mongo/MongoUserDao";
import JwtSocket from "../../middlewares/jwt/JwtSocket";
import SocketIOMiddleware from "../../middlewares/SocketIOMiddleware";
import ChatEvent from "./events/ChatEvent";
import { SocketEvents } from "./SocketEvents";
import Chat from "../../business-logic/entity/Chat";
import ProxyChatDao from "../../data-access/proxy/ProxyChatDao";
import { AppGroups } from "../../business-logic/GroupsEnum";
import { serialize } from "@tsed/json-mapper";

@SocketService()
export default class ChatSocketService{

    private _activeUsers: Map<Socket,User>;
    private _activeChats: Map<string,Chat>;//para agarrarlos por el id
    private _chatDao: ChatDao;

    constructor(
        @IO private  io:Server,
        @Inject(JwtSocket) private mid:SocketIOMiddleware,
        @Inject(MongoUserDao) private _userDao:UserDao,
        @Inject(MongoChatDao) _chatDao:ChatDao,
        @Inject(ActiveEvents) private events:ChatEvent[]
    ){
        io.use((socket:Socket,next:any) => mid.action(socket,next));
        this._activeUsers = new Map<Socket,User>();
        this._activeChats = new Map<string,Chat>();
        this._chatDao = new ProxyChatDao(_chatDao,this._activeChats);
    }
        
    $onConnection(@SocketParam socket:Socket){
        this.userDao.get(this.mid.getInfo(socket).userId)
        .then(user => {
                if(!user){
                    $log.error("Socket invalid user")
                    socket.emit(SocketEvents.ERROR,"Invalid user");
                    socket.disconnect(true);
                }else{
                    this.removeIfConnected(user);
                    this._activeUsers.set(socket,user);
                    this.setEvents(socket);
                    $log.info(user.username+" se conecto!");
                    socket.emit(SocketEvents.CONNECTION_SUCCESS,serialize(user,{ type: User, groups: AppGroups.USER }));
                }
        })
        .catch(err => this.socketErrorHandler(err,socket));
    }

    get userDao(){
        return this._userDao;
    }

    get chatDao(){
        return this._chatDao;
    }

    get activeUsers(){
        return this._activeUsers;
    }

    get activeChats(){
        return this._activeChats;
    }
    
    socketErrorHandler(err:any, socket:Socket){
        socket.emit(SocketEvents.ERROR,err.message);
        socket.disconnect(true);
        console.log(err);
        $log.error("ERROR ON SOCKET CONNECTION")
    }

    private removeIfConnected(user:User):void{
        //tupla [socket,User]
        let result:[Socket,User] = [...this.activeUsers.entries()]
                    .filter( entry => entry[1].username === user.username)[0];
                    
        if(!result) 
            return;

        let socket = result[0];
        socket.emit(SocketEvents.OTHER_CONNECTION,"Another connection started");
        socket.disconnect(true);
    }

    private setEvents(socket:Socket):void{
        this.events.forEach(e => {
            socket.on(e.eventName,(args) => e.handle(socket,this,args));
        });
    }

    nextEvent(event:SocketEvents,socket:Socket,args:any){
        this.events.filter(e => e.eventName === event)
            .forEach(e => {
                e.handle(socket,this,args);
            });
    }

    runForChat(chat:Chat,event:SocketEvents,args:any){

        let activeChat:Chat|undefined;
        if(chat.id)
            activeChat = this.activeChats.get(chat.id);
        else
            return;
        
        if(!activeChat) return;

        this.io.to(chat.id).emit(event,serialize(args,{ type: Chat, groups: AppGroups.CHAT }));

    }

    runForUser(user:User,event:SocketEvents,args:any){
        
        let activeUser:User|undefined = [...this.activeUsers.values()].filter(u => u.id === user.id)[0];

        let chat = activeUser?.actualChat;

        if(!chat || !chat.id) return;

        this.io.to(chat.id).emit(event,serialize(args,{ type: User, groups: AppGroups.USER }));

    }

}