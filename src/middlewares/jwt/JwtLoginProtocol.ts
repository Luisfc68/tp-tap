import { Constant, Inject } from "@tsed/di";
import { UserDao } from "../../data-access/da.interfaces";
import MongoUserDao from "../../data-access/mongo/MongoUserDao";
import { Protocol } from "@tsed/passport";
import { $log, BodyParams, Req } from "@tsed/common";
import User from "../../business-logic/entity/User";
import { IStrategyOptions,Strategy } from "passport-local";
import { BadRequest, Unauthorized } from "@tsed/exceptions";
import { sign } from "jsonwebtoken";
import AuthProtocol from "../AuthProtocol";

@Protocol<IStrategyOptions>({
    name: "login",
    useStrategy: Strategy,
    settings: {
        usernameField: "username",
        passwordField: "password"
    }
})
export default class JwtLoginProtocol extends AuthProtocol{

    @Constant("passport.protocols.jwt.settings")
    private jwtSettings:any;

    constructor(@Inject(MongoUserDao)userDao:UserDao){
        super(userDao);
    }

    $onVerify(@Req() _request: Req, @BodyParams() credentials: any):Promise<string>{
        
        const { username, password } = credentials;
        const invalidMsg = "Invalid username or password";
        return  super.userDao!
                .getByUsername(username)
                .then( user => {
                    if(!user)
                        throw new Unauthorized(invalidMsg);
                    else if(user.password !== password)
                        throw new Unauthorized(invalidMsg);
                        
                    const token = this.createToken(user);

                    return token;
                })
                .catch(err => {
                    $log.error("CATCHED USERDAO EXCEPTION ON LOGIN ENDPOINT");
                    $log.error(err);
                    throw new BadRequest(err.message);
                });
    }

    private createToken(user:User):string{

        const { secretOrKey } = this.jwtSettings;
        const now = Date.now();

        return sign(
            {
              userId: user.id,
              iat: now
            },
            secretOrKey
          );
    }

}