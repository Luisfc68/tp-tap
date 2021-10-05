import { Controller, Get } from "@tsed/common";
import {  Post, Returns } from "../../node_modules/@tsed/schema/lib";
import Chat from "../business-logic/entity/Chat";
import User from "../business-logic/entity/User";
import ChatFactory from "../business-logic/factory/ChatFactory";
import UserFactory from "../business-logic/factory/UserFactory";
import MyService from "../temporales/Mongoose";

/*
  * CAMBIAR NOMBRE DE CARPETA A CONTROLLER EN SINGULAR
*/

@Controller("/prueba")
export class PruebasController {
  
  private servicio;
  
  constructor(servicio:MyService){
    this.servicio = servicio;
  }
  
  
  @Get()
  findAll(): string {
    return "OK!";
  }
  
  @Get("/mongoose")
  @(Returns(200,User).Groups("userRepresentation").Description("no sirve"))
  async db(): Promise<User> {

    let fu: UserFactory = new UserFactory();
    let fc: ChatFactory = new ChatFactory();

    
    let u1 = fu.createRegularUser("https://i.imgur.com/zPFuLVO.jpeg","luisfc68","123","prueba@correo");
    let u2 = fu.createRegularUser("https://i.imgur.com/zPFuLVO.jpeg","2","123","prueba2@correo");
    
    u1 = await this.servicio.guardar(u1);
    u2 = await this.servicio.guardar(u2);

    let c = fc.createChat("mi chat","none","algo",u1,["1","a","<"]);
    c = await this.servicio.guardarChat(c);


    u1.favChats.push(c);

    //console.log(u1)
      
    //await this.servicio.updateUser(u1)
    
    return u1;
  }

  @Get("/mongoose/leer")
  async leer(){
    return this.servicio.leer("luisfc68");
  }

  @Post("/test")
  @Returns(206,Chat).Groups("chatRepresentation")
  getSimpleRepresentation() {

    let uf: UserFactory = new UserFactory();
    let cf: ChatFactory = new ChatFactory();
    
    let user:User = uf.createRegularUser("imageUrl","example","123","example@");
    let chat = cf.createChat("title","chatImg","some description",user,["tag1","tag2"]);
    user.favChats.push(chat)

    return chat;
    
  }

}