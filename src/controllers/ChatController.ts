import { $log, BodyParams, Req } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { BadRequest, Forbidden, NotFound } from "@tsed/exceptions";
import { Authorize } from "@tsed/passport";
import { Post, Returns } from "@tsed/schema";
import Chat from "../business-logic/entity/Chat";
import User from "../business-logic/entity/User";
import ChatFactory from "../business-logic/factory/ChatFactory";
import { AppGroups } from "../business-logic/GroupsEnum";
import { ChatDao, UserDao } from "../data-access/da.interfaces";
import MongoChatDao from "../data-access/mongo/MongoChatDao";
import MongoUserDao from "../data-access/mongo/MongoUserDao";
import { ErrorModifiers } from "../errors/errorEnum";

@Controller("/chat")
export default class ChatController{

    constructor(
        @Inject(MongoChatDao) private readonly chatDao:ChatDao,
        @Inject(MongoUserDao) private readonly userDao:UserDao,
        private readonly chatFactory: ChatFactory
    ){}

    private verifyId(req:Req):string{
        const id = <string>req.user;
        if(!id)
            throw new BadRequest("Invalid user ID");
        return id;
    }

    @Post()
    @Authorize("jwt")
    @Returns(201,Chat).Groups(AppGroups.CHAT)
    newChat(@Req() req:Req, @BodyParams(Chat) reqChat:Chat):Promise<Chat>{
        let createdChat:Chat;
        let chatCreator:User;
        return  this.userDao.get(this.verifyId(req))
                .then(user => {
                    if(!user)
                        throw new NotFound("User not found");
                    let chat = this.chatFactory.createChatUsingSubscription(reqChat.title,reqChat.description,user,reqChat.tags);
                    chatCreator = user;
                    return this.chatDao.insert(chat);
                })
                .then(chat => {
                    createdChat = chat;
                    return this.userDao.update(chatCreator);
                })
                .then(() => createdChat)
                .catch(err => {
                    $log.error("CATCHED CHATDAO EXCEPTION ON NEWCHAT ENDPOINT");
                    $log.error(err);

                    if(err.modifier && err.modifier === ErrorModifiers.DUP_KEY)
                         throw new BadRequest("There is already a chat with that title");

                    else if(err.modifier && err.modifier === ErrorModifiers.MAX_CHAT)
                        throw new Forbidden(err.message);

                    throw new BadRequest("Bad parameters");
                });

    }

}