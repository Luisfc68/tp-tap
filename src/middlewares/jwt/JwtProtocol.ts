import AuthProtocol from "../AuthProtocol";
import { Strategy } from "passport-jwt";
import { Arg, Protocol } from "@tsed/passport";
import { Req } from "@tsed/common";
import jwtSettings from "../../configurations/jwtAuth.config"

@Protocol({
    name: "jwt",
    useStrategy: Strategy,
    settings: jwtSettings
})
export default class JwtProtocol extends AuthProtocol{

    constructor(){
        super();
    }

    $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any):string{
        req.user = jwtPayload.userId;
        return jwtPayload.userId;
    }

}