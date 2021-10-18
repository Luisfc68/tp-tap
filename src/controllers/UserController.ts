import { Controller, Inject } from "@tsed/di";
import { BodyParams } from "@tsed/platform-params";
import { Get, Patch, Post, Put, Required, Returns } from "@tsed/schema";
import User from "../business-logic/entity/User";
import UserFactory from "../business-logic/factory/UserFactory";
import { AppGroups } from "../business-logic/GroupsEnum";
import { UserDao } from "../data-access/da.interfaces";
import MongoUserDao from "../data-access/mongo/MongoUserDao";
import { $log} from "@tsed/logger";
import { BadRequest, Forbidden, NotFound } from "@tsed/exceptions";
import { ErrorModifiers} from "../errors/errorEnum";
import { Authenticate, Authorize } from "@tsed/passport";
import { MultipartFile, PlatformMulterFile, Req, Res } from "@tsed/common";
import { SubscriptionPlan } from "../business-logic/bl.interfaces";
import PlanFactory from "../business-logic/factory/PlanFactory";
import ImageService from "../services/image/ImageService";
import LocalImageService from "../services/image/LocalImageService";
import BaseController from "./Controller"

@Controller("/user")
export default class UserController extends BaseController{

    constructor(
        @Inject(MongoUserDao) private readonly userDao:UserDao,
        private readonly userFactory: UserFactory,
        private readonly planFactory: PlanFactory,
        @Inject(LocalImageService) private readonly imageService: ImageService
    ){
        super();
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

    @Post("/login")
    @Authenticate("login")
    @Returns(201,String)
    login(@Req() req: Req, @Required() @BodyParams("username") _username: string, @Required() @BodyParams("password") _password: string) {
        //FUNCIONA COMO FACHADA DEL PROTOCOLO
        return req.user;
    }

    @Put()
    @Authorize("jwt")
    @Returns(200,User).Groups(AppGroups.USER)
    updateUser(@Req() req: Req,@BodyParams(User) reqUser:User):Promise<User>{

        const id = super.verifyId(req);

        return  this.userDao.get(id)
                .then(user => {
                    if(!user)
                        throw new NotFound("User not found");

                    user.username = reqUser.username; //favChats cambia por socket y plan e img por otros endpoint
                    user.password = reqUser.password;
                    user.email = reqUser.email;

                    return this.userDao.update(user);
                })
                .then(user => {
                    if(!user)
                        throw new NotFound("User not found");
                    return user;
                })
                .catch(err => {
                    $log.error("CATCHED USERDAO EXCEPTION ON UPDATEUSER ENDPOINT");
                    $log.error(err);
                    throw new BadRequest(err.message);
                });
    }

    private resolvePlan(name: string): SubscriptionPlan|undefined {
        
        let plan:SubscriptionPlan|undefined;

        switch(name){
            case "premium":
                plan = this.planFactory.createPremiumPlan();
                break;
            case "regular": 
                plan = this.planFactory.createRegularPlan();
                break;
            case "medium": 
                plan = this.planFactory.createMidPlan();
        }

        return plan;
    }

    @Patch("/plan")
    @Authorize("jwt")
    @Returns(200,User).Groups(AppGroups.USER)
    changePlan(@Req() req: Req,@Required() @BodyParams("plan") planName: string):Promise<User>{

        const id = super.verifyId(req);

        return  this.userDao.get(id)
                .then(user => {

                    if(!user)
                        throw new NotFound("User not found");
                    else if(user.plan.canCreateChat())
                        throw new Forbidden("You still can use your actual plan");

                    let newPlan = this.resolvePlan(planName);
                    if(!newPlan)
                        throw new NotFound("Subscription plan not found");

                    user.plan = newPlan;
                    return this.userDao.update(user);
                })
                .then(user => {
                    if(!user)
                        throw new NotFound("User not found");
                    return user;
                })
                .catch(err => {
                    $log.error("CATCHED USERDAO EXCEPTION ON CHANGEPLAN ENDPOINT");
                    $log.error(err);
                    throw new BadRequest(err.message);
                });
    }

    @Post("/image")
    @Authorize("jwt")
    @Returns(200,User).Groups(AppGroups.USER)
    setUserImage(@Req() req: Req,@MultipartFile("file") file: PlatformMulterFile):Promise<User>{
        
        const id = super.verifyId(req);
        let user:User;
        
        return  this.userDao.get(id)
                .then(u => {
                    if(!u)
                        throw new NotFound("User not found");
                    user = u;
                    return this.imageService.saveImage(id,AppGroups.USER,file);
                })
                .then(img => {
                    user.imgUrl = img;
                    return this.userDao.update(user);
                })
                .then(user => {
                    if(!user)
                        throw new NotFound("User not found");
                    return user;
                })
                .catch(err => {
                    $log.error("CATCHED EXCEPTION ON CHANGEIMAGE ENDPOINT");
                    $log.error(err);
                    throw new BadRequest(err.message);
                });
    }

    @Get("/image")
    @Authorize("jwt")
    getUserImage(@Req() req:Req,@Res() res:Res) {

        const id = super.verifyId(req);
        
        return  this.userDao.get(id)
                .then(user => {
                    if(!user)
                        throw new NotFound("User not found");
                    let img:string = user.imgUrl;
                    let extension = img.slice(img.lastIndexOf(".")+1);
                    res.contentType("image/"+extension);
                    return this.imageService.getImage(user.imgUrl,AppGroups.USER);
                })
                .catch(err => {
                    $log.error("CATCHED EXCEPTION ON GETIMAGE ENDPOINT");
                    $log.error(err);
                    throw new NotFound(err.message);
                });
    }
    
}