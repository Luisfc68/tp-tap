import { Req } from "@tsed/common";
import { BadRequest } from "@tsed/exceptions";

export default class Controller{
    
    protected verifyId(req:Req):string{
        const id = <string>req.user;
        if(!id)
            throw new BadRequest("Invalid user ID");
        return id;
    }
}