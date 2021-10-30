import SocketIOMiddleware from "../SocketIOMiddleware";
import { verify } from "jsonwebtoken";
import jwtAuthConfig from "../../configurations/jwtAuth.config";
import { Socket, } from "socket.io";
import { Unauthorized } from "@tsed/exceptions";
import { $log } from "@tsed/logger";
import { Injectable } from "@tsed/di";

@Injectable()
export default class JwtSocket extends SocketIOMiddleware{

    private readonly secret:string = <string>jwtAuthConfig.secretOrKey;

    action(socket:Socket,next:any):void{
        try{
            this.getInfo(socket);
            next();
        }catch(e:any){
            $log.error("SOCKET AUTH FAILED");
            console.log(e.message);
            throw new Unauthorized(e.message);
        }
    }

    getInfo(socket:Socket):any{
        return verify(socket.handshake.auth.token,this.secret);
    }

}