import { $log, BodyParams, PathParams, Req } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { BadRequest, Forbidden, NotFound } from "@tsed/exceptions";
import { Authorize } from "@tsed/passport";
import { Delete, Post, Put, Returns } from "@tsed/schema";
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

    private isOwner(userId:string, chat:Chat):boolean{
        const ownerId = (<User>chat.owner)._id?.toString();
        return userId === ownerId;
    }

    private checkOperationConditions(userId:string, chat:Chat|null):void{
        if(!chat)
            throw new NotFound("Chat not found");
        else if(!this.isOwner(userId,chat))
            throw new Forbidden("You are not the owner of the chat");
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

    @Delete("/:chatId")
    @Authorize("jwt")
    @Returns(200,Chat).Groups(AppGroups.CHAT)
    deleteChat(@Req() req:Req, @PathParams("chatId") chatId:string):Promise<Chat>{
        const userId = this.verifyId(req);
        return  this.chatDao.get(chatId)
                .then(chat => {
                    this.checkOperationConditions(userId,chat);
                    return this.chatDao.delete(chatId);
                })
                .then(chat => chat!)
                .catch(err => {
                    $log.error("CATCHED CHATDAO EXCEPTION ON DELETECHAT ENDPOINT");
                    $log.error(err);

                    throw new BadRequest(err.message);
                });
    }
    
    @Put("/:chatId")
    @Authorize("jwt")
    @Returns(200,Chat).Groups(AppGroups.CHAT)
    updateChat(@Req() req:Req, @PathParams("chatId") chatId:string, @BodyParams(Chat) reqChat:Chat):Promise<Chat>{
        const userId = this.verifyId(req);
        return  this.chatDao.get(chatId)
                .then(chat => {

                    this.checkOperationConditions(userId,chat);
                    chat!.title = reqChat.title;
                    chat!.description = reqChat.description;
                    chat!.tags = reqChat.tags;

                    return this.chatDao.update(chat!);
                })
                .then(chat => chat!)
                .catch(err => {
                    $log.error("CATCHED CHATDAO EXCEPTION ON UPDATECHAT ENDPOINT");
                    $log.error(err);

                    throw new BadRequest(err.message);
                });
    }
}