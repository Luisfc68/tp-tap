import { Socket } from "socket.io";
import { Injectable } from "../../../../../node_modules/@tsed/di/lib";
import { $log } from "../../../../../node_modules/@tsed/logger/lib";
import ChatSocketService from "../../ChatSocketService";
import { SocketEvents } from "../../SocketEvents";
import ChatEvent from "../ChatEvent";

@Injectable()
export default class UserDisconnected extends ChatEvent{

    constructor(){
        super(SocketEvents.DISCONECT);
    }

    checkArgs(_args: any): boolean {
       return true;
    }
    
    executeEvent(socket:Socket,service:ChatSocketService,args:any):void{
        console.log(SocketEvents.DISCONECT);
        let user = service.activeUsers.get(socket);
        if(!user) return;
        $log.info(user.username+" se desconecto");

        if(user.actualChat)
            service.nextEvent(SocketEvents.LEAVE_ROOM,socket,args);
        
        service.activeUsers.delete(socket);

    };

}