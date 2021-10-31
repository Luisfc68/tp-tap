import { $log, BodyParams, MultipartFile, PathParams, PlatformMulterFile, Req, Res } from "@tsed/common";
import { Controller, Inject } from "@tsed/di";
import { BadRequest, Forbidden, NotFound } from "@tsed/exceptions";
import { Authorize } from "@tsed/passport";
import { Delete, Get, Post, Put, Returns } from "@tsed/schema";
import Chat from "../business-logic/entity/Chat";
import User from "../business-logic/entity/User";
import ChatFactory from "../business-logic/factory/ChatFactory";
import { AppGroups } from "../business-logic/GroupsEnum";
import { ChatDao, UserDao } from "../data-access/da.interfaces";
import MongoChatDao from "../data-access/mongo/MongoChatDao";
import MongoUserDao from "../data-access/mongo/MongoUserDao";
import { ErrorModifiers } from "../errors/errorEnum";
import ImageService from "../services/image/ImageService";
import LocalImageService from "../services/image/LocalImageService";
import ChatSocketService from "../services/socket/ChatSocketService";
import { SocketEvents } from "../services/socket/SocketEvents";
import BaseController from "./Controller"

@Controller("/chat")
export default class ChatController extends BaseController{

    constructor(
        @Inject(MongoChatDao) private readonly chatDao:ChatDao,
        @Inject(MongoUserDao) private readonly userDao:UserDao,
        private readonly chatFactory: ChatFactory,
        @Inject(LocalImageService) private readonly imageService: ImageService,
        private readonly socketService:ChatSocketService
    ){
        super();
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
        return  this.userDao.get(super.verifyId(req))
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
        const userId = super.verifyId(req);
        return  this.chatDao.get(chatId)
                .then(chat => {
                    this.checkOperationConditions(userId,chat);
                    return this.chatDao.delete(chatId);
                })
                .then(chat => chat!)
                .catch(err => {
                    $log.error("CATCHED CHATDAO EXCEPTION ON DELETECHAT ENDPOINT");
                    $log.error(err);
                    if(err.status === 404 || err.status === 403) throw err;
                    throw new BadRequest(err.message);
                });
    }
    
    @Put("/:chatId")
    @Authorize("jwt")
    @Returns(200,Chat).Groups(AppGroups.CHAT)
    updateChat(@Req() req:Req, @PathParams("chatId") chatId:string, @BodyParams(Chat) reqChat:Chat):Promise<Chat>{
        const userId = super.verifyId(req);
        return  this.chatDao.get(chatId)
                .then(chat => {

                    this.checkOperationConditions(userId,chat);
                    chat!.title = reqChat.title;
                    chat!.description = reqChat.description;
                    chat!.tags = reqChat.tags;

                    return this.chatDao.update(chat!);
                })
                .then(chat => {
                    if(!chat)
                        throw new NotFound("Chat not found");
                    this.socketService.runForChat(chat,SocketEvents.CHAT_CHANGED,chat);
                    return chat;
                })
                .catch(err => {
                    $log.error("CATCHED CHATDAO EXCEPTION ON UPDATECHAT ENDPOINT");
                    $log.error(err);
                    if(err.status === 404 || err.status === 403) throw err;
                    throw new BadRequest(err.message);
                });
    }


    @Post("/image/:chatId")
    @Authorize("jwt")
    @Returns(200,Chat).Groups(AppGroups.CHAT)
    setChatImage(@Req() req: Req,@MultipartFile("image") file: PlatformMulterFile, @PathParams("chatId") chatId:string):Promise<Chat>{
        
        if(!file)
            throw new BadRequest("Image not provided");
        
        const userId = super.verifyId(req);
        let chat:Chat;
        return  this.chatDao.get(chatId)
                .then(c => {
                    this.checkOperationConditions(userId,c);
                    chat = c!;
                    return this.imageService.saveImage(chatId,AppGroups.CHAT,file);
                })
                .then(img => {
                    chat.imgUrl = img;
                    return this.chatDao.update(chat);
                })
                .then(c => {
                    if(!c)
                        throw new NotFound("Chat not found");
                    this.socketService.runForChat(c,SocketEvents.CHAT_CHANGED,c);
                    return c;
                })
                .catch(err => {
                    $log.error("CATCHED EXCEPTION ON CHANGEIMAGE ENDPOINT");
                    $log.error(err);
                    if(err.status === 404 || err.status === 403) throw err;
                    throw new BadRequest(err.message);
                });
    }

    @Get("/image/:chatId")
    @Authorize("jwt")
    getChatImage(@Res() res:Res,@PathParams("chatId") chatId:string){

        return  this.chatDao.get(chatId)
                .then(chat => {
                    if(!chat)
                        throw new NotFound("Chat not found");
                    let img:string = chat.imgUrl;
                    let extension = img.slice(img.lastIndexOf(".")+1);
                    res.contentType("image/"+extension);
                    return this.imageService.getImage(chat.imgUrl,AppGroups.CHAT);
                })
                .catch(err => {
                    $log.error("CATCHED EXCEPTION ON GETIMAGE ENDPOINT");
                    $log.error(err);
                    throw new NotFound(err.message);
                });
    }


}