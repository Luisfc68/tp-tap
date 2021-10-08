import { Controller, Get, Inject } from "@tsed/common";
import { deserialize } from "@tsed/json-mapper";
import {  Post, Returns } from "../../node_modules/@tsed/schema/lib";
import User from "../business-logic/entity/User";
import ChatFactory from "../business-logic/factory/ChatFactory";
import UserFactory from "../business-logic/factory/UserFactory";
import { ChatDao, UserDao } from "../data-access/da.interfaces";
import MongoChatDao from "../data-access/mongo/MongoChatDao";
import MongoUserDao from "../data-access/mongo/MongoUserDao";

/*
  * CAMBIAR NOMBRE DE CARPETA A CONTROLLER EN SINGULAR
*/

@Controller("/prueba")
export class PruebasController {
  
  private userDao:UserDao;
  private chatDao:ChatDao
  
  constructor(@Inject(MongoUserDao) userDao:UserDao, @Inject(MongoChatDao) chatDao:ChatDao){
    this.userDao = userDao;
    this.chatDao = chatDao;
  }
  
  
  @Get()
  findAll(): string {
    return "OK!";
  }
  
  @Get("/mongoose")
  @Returns(200,User).Groups("userRepresentation")
  async db(): Promise<User|null> {

    let fu: UserFactory = new UserFactory();
    let fc: ChatFactory = new ChatFactory();

    
    let u1: User|null = fu.createRegularUser("https://i.imgur.com/zPFuLVO.jpeg","luisfc68","123","prueba@correo");
    
    u1 = await this.userDao.insert(u1);

    let c = fc.createChat("mi chat","none","algo",u1,["1","a","<"]);

    c = await this.chatDao.insert(c);

    u1.favChats.push(c);

    u1 = await this.userDao.update(u1);


    return u1;
  }

  /*@Get("/mongoose/leer")
  async leer(){
    return this.servicio.leer("luisfc68");
  }*/

  @Post("/test")
  @Returns(200,User).Groups("userRepresentation")
  getSimpleRepresentation() {

    let uf: UserFactory = new UserFactory();
    let cf: ChatFactory = new ChatFactory();
    
    let user:User = uf.createRegularUser("imageUrl","example","123","example@");
    let chat = cf.createChat("title","chatImg","some description",user,["tag1","tag2"]);
    user.favChats.push(chat)

    console.log(deserialize(user,{groups: ['userRepresentation']}))
    console.log(deserialize(chat,{groups: ['chatRepresentation']}))

    return user;
    
  }

  @Get("/serv")
  prueba(){
    this.chatDao.insert(null as any);
  }

}