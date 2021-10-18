import { IO, Server, SocketService, Socket as SocketParam } from "@tsed/socketio";
import { Socket } from "socket.io"
import { Inject } from "../../../node_modules/@tsed/di/lib";
import { $log } from "../../../node_modules/@tsed/logger/lib";
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

@SocketService()
export default class ChatSocketService{

    private _activeUsers: Map<Socket,User>;
    private _activeChats: Set<Chat>;
    
    constructor(
        @IO io:Server,
        @Inject(JwtSocket) private mid:SocketIOMiddleware,
        @Inject(MongoUserDao) private _userDao:UserDao,
        @Inject(MongoChatDao) private _chatDao:ChatDao,
        @Inject(ActiveEvents) private events:ChatEvent[]
    ){
        io.use((socket:Socket,next:any) => mid.action(socket,next));
        this._activeUsers = new Map<Socket,User>();
        this._activeChats = new Set<Chat>();
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
        socket.emit(SocketEvents.ERROR,"Another connection started");
        socket.disconnect(true);
    }

    private setEvents(socket:Socket):void{
        this.events.forEach(e => {
            socket.on(e.eventName,(args) => e.executeEvent(socket,this,args))
        });
    }

}