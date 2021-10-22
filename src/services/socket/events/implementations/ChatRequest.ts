import { Socket } from "socket.io";
import { serialize } from "@tsed/json-mapper";
import Chat from "../../../../business-logic/entity/Chat";
import { AppGroups } from "../../../../business-logic/GroupsEnum";
import ChatSocketService from "../../ChatSocketService";
import { SocketEvents } from "../../SocketEvents";
import ChatEvent from "../ChatEvent";
import { Injectable } from "@tsed/di";

@Injectable()
export default class ChatRequest extends ChatEvent {
    
    constructor() {
        super(SocketEvents.CHAT_REQUEST);    
    }

    checkArgs(args:any):boolean{
        //la busqueda es opcional por eso no se checkquea aqui
        return args.offset !== undefined;
    }

    executeEvent(socket:Socket,service:ChatSocketService,args:any):void{
        console.log(SocketEvents.CHAT_REQUEST);
        const { title,description,tags,offset } = args;
        const queryOffset:number = parseInt(offset);

        service.chatDao.chatQuery(queryOffset,{ title,description,tags })
               .then(chats => {
                    let serialized = serialize(chats,{type: Chat,groups: AppGroups.CHAT});
                    socket.emit(SocketEvents.CHAT_REQUEST,serialized);
               })
               .catch(e => {
                    socket.emit(SocketEvents.ERROR,e.message);
                });
    }

}