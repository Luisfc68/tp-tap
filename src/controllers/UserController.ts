import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Post, Returns } from "@tsed/schema";
import User from "../business-logic/entity/User";
import UserFactory from "../business-logic/factory/UserFactory";
import { AppGroups } from "../business-logic/GroupsEnum";
import { UserDao } from "../data-access/da.interfaces";
import MongoUserDao from "../data-access/mongo/MongoUserDao";
import { $log} from "@tsed/logger";
import { BadRequest } from "@tsed/exceptions";
import { ErrorModifiers} from "../errors/errorEnum";

@Controller("/user")
export default class UserController{

    private readonly userDao:UserDao
    private readonly userFactory: UserFactory;

    constructor(@Inject(MongoUserDao)userDao:UserDao,userFactory:UserFactory){
        this.userDao = userDao;
        this.userFactory = userFactory;
    }

    @Post("/signup")
    @Returns(201,User).Groups(AppGroups.USER)
    signup(@BodyParams(User) reqUser:User):Promise<User>{

        let newUser = this.userFactory.createRegularUser(reqUser.username,reqUser.password,reqUser.email);

        return this.userDao.insert(newUser)
               .catch(err => {
                   $log.error("CATCHED USERDAO EXCEPTION ON SIGNUP ENDPOINT");
                   $log.error(err);
                   if(err.modifier && err.modifier === ErrorModifiers.DUP_KEY)
                        throw new BadRequest("Username or email already in use");
                   throw new BadRequest("Bad parameters");
               });
    }

}