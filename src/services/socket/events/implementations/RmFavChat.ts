import { Socket } from "socket.io";
import { Injectable } from "../../../../../node_modules/@tsed/di/lib";
import { serialize } from "@tsed/json-mapper";
import User from "../../../../business-logic/entity/User";
import ChatSocketService from "../../ChatSocketService";
import { SocketEvents } from "../../SocketEvents";
import ChatEvent from "../ChatEvent";
import { AppGroups } from "../../../../business-logic/GroupsEnum";

@Injectable()
export default class RmFavChat extends ChatEvent{

    constructor(){
        super(SocketEvents.RM_FAV_CHAT);
    }

    checkArgs(args:any):boolean{
        return args.chatId;
    }

    executeEvent(socket:Socket,service:ChatSocketService,args:any):void{
        console.log(SocketEvents.RM_FAV_CHAT);
        let user: User|undefined = service.activeUsers.get(socket);
        if(!user) return;

        service.chatDao.get(args.chatId)
        .then(chat => {
            
            if(!chat) return;
            
            user!.removeFavChat(chat);
            return service.userDao.update(user!);
        })
        .then(user => {

            if(!user) return;
            socket.emit(SocketEvents.RM_FAV_CHAT,serialize(user,{ type: User, groups: AppGroups.USER }));
        })
        .catch(e => {
            socket.emit(SocketEvents.ERROR,e.message);
        });
    }
    
}