import { Socket } from "socket.io";
import { Injectable } from "@tsed/di";
import User from "../../../../business-logic/entity/User";
import ChatSocketService from "../../ChatSocketService";
import { SocketEvents } from "../../SocketEvents";
import ChatEvent from "../ChatEvent";
import { $log } from "@tsed/logger";
import { AppGroups } from "../../../../business-logic/GroupsEnum";
import { serialize } from "@tsed/json-mapper";

@Injectable()
export default class JoinRoom extends ChatEvent{

    constructor(){
        super(SocketEvents.JOIN_ROOM);
    }

    checkArgs(args: any): boolean {
        return args.chatId;
    }

    executeEvent(socket:Socket,service:ChatSocketService,args:any):void{
        console.log(SocketEvents.JOIN_ROOM);
        let user:User|undefined = service.activeUsers.get(socket)

        if(!user)
            return;

        service.chatDao.get(args.chatId)
        .then( chat => {
           
            if(!chat){
                socket.emit(SocketEvents.ERROR,"Chat not found");
                return;
            }

            chat.addUser(user!);
            let serialized = serialize(user,{type: User,groups: [AppGroups.USER]});
            socket.to(chat.id!).emit(SocketEvents.JOIN_ROOM,serialized);
            socket.join(chat.id!);
            socket.emit(SocketEvents.JOIN_CONFIRM);
        })
        .catch(e => {
            $log.error(e);
            socket.emit(SocketEvents.ERROR,e.message);
        });
        
    }

}