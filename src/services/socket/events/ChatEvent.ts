import { Socket } from "socket.io";
import ChatSocketService from "../ChatSocketService";
import { SocketEvents } from "../SocketEvents";

export default abstract class ChatEvent{

    constructor(
        private readonly _eventName:string
    ){}

    get eventName(){
        return this._eventName;
    }

    abstract checkArgs(...args:any):boolean;
    abstract executeEvent(socket:Socket,service:ChatSocketService,...args:any):void;

    handle(socket:Socket,service:ChatSocketService,...args:any){

        if(this.checkArgs(args)){
            this.executeEvent(socket,service,args);
        }else{
            socket.emit(SocketEvents.ERROR,"Bad args");
        }

    }

}