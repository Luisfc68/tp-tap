import { Socket, } from "socket.io";

export default abstract class SocketIOMiddleware{

   abstract action(socket:Socket,next:any):void;
   abstract getInfo(socket:Socket):any;
   
}