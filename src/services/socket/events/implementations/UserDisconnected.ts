import { Socket } from "socket.io";
import { Injectable } from "../../../../../node_modules/@tsed/di/lib";
import { serialize } from "@tsed/json-mapper";
import { $log } from "../../../../../node_modules/@tsed/logger/lib";
import ChatSocketService from "../../ChatSocketService";
import { SocketEvents } from "../../SocketEvents";
import ChatEvent from "../ChatEvent";
import User from "../../../../business-logic/entity/User";
import { AppGroups } from "../../../../business-logic/GroupsEnum";

@Injectable()
export default class UserDisconnected extends ChatEvent{

    constructor(){
        super(SocketEvents.DISCONECT);
    }

    checkArgs(_args: any): boolean {
       return true;
    }
    
    executeEvent(socket:Socket,service:ChatSocketService,..._args:any):void{
        console.log(SocketEvents.DISCONECT);
        let user = service.activeUsers.get(socket);
        if(!user) return;
        $log.info(user.username+" se desconecto");

        if(user.actualChat && user.actualChat.id){
            let serialized = serialize(user,{type: User,groups: [AppGroups.USER]})
            socket.to(user.actualChat.id).emit(SocketEvents.LEAVE_ROOM,serialized);
        }
        
        service.activeUsers.delete(socket);

    };

}