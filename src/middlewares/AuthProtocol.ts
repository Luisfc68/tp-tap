import { OnVerify } from "@tsed/passport";
import { UserDao } from "../data-access/da.interfaces";


export default abstract class AuthProtocol implements OnVerify{
    
    constructor(
        private readonly _userDao?:UserDao
    ){}

    abstract $onVerify(...args: any[]):any; //return definido por la implementación

    get userDao(){
        return this._userDao;
    }

}