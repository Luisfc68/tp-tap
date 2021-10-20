import ChatEvent from "../ChatEvent";
import { Socket } from "socket.io";
import ChatSocketService from "../../ChatSocketService";
import User from "../../../../business-logic/entity/User";
import { SocketEvents } from "../../SocketEvents";
import { Injectable } from "@tsed/di";
import Message from "../../../../business-logic/entity/Message";
import { AppGroups } from "../../../../business-logic/GroupsEnum";
import { serialize } from "@tsed/json-mapper";

@Injectable()
export default class MessageRequest extends ChatEvent{

    constructor(){
        super(SocketEvents.MSG_REQUEST);
    }

    checkArgs(args:any):boolean{
        return args.offset;
    }

    executeEvent(socket:Socket,service:ChatSocketService,args:any):void{
        console.log(SocketEvents.MSG_REQUEST);
        let offset = parseInt(args.offset);
        let user:User|undefined = service.activeUsers.get(socket);

        if(!user || !user.actualChat) return;

        service.chatDao.getMessages(user.actualChat,offset)
            .then(messages => {
                let serialized = serialize(messages,{type: Message,groups: AppGroups.MSG});
                socket.emit(SocketEvents.MSG_REQUEST,serialized);
            })
            .catch(e => {
                socket.emit(SocketEvents.ERROR,e.message);
            });

    }
}