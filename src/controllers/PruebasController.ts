import { BodyParams, Controller, Get, HeaderParams, Inject, QueryParams, Req } from "@tsed/common";
import { Post, Required, Returns } from "../../node_modules/@tsed/schema/lib";
import Chat from "../business-logic/entity/Chat";
import { AppGroups } from "../business-logic/GroupsEnum";
import Message from "../business-logic/entity/Message";
import PremiumPlan from "../business-logic/entity/PremiumPlan";
import User from "../business-logic/entity/User";
import ChatFactory from "../business-logic/factory/ChatFactory";
import UserFactory from "../business-logic/factory/UserFactory";
import { ChatDao, UserDao } from "../data-access/da.interfaces";
import MongoChatDao from "../data-access/mongo/MongoChatDao";
import MongoUserDao from "../data-access/mongo/MongoUserDao";
import { Authenticate, Authorize } from "@tsed/passport";

/*
  * CAMBIAR NOMBRE DE CARPETA A CONTROLLER EN SINGULAR
*/

@Controller("/prueba")
export class PruebasController {
  
  private userDao:UserDao;
  private chatDao:ChatDao;
  
  constructor(@Inject(MongoUserDao) userDao:UserDao, @Inject(MongoChatDao) chatDao:ChatDao){
    this.userDao = userDao;
    this.chatDao = chatDao;
  }
  
  
  @Get()
  findAll(): string {
    return "OK!";
  }
  
  @Get("/same")
  @Returns(200,User).Groups(AppGroups.USER)
  async db(): Promise<User|null> {

    let fu: UserFactory = new UserFactory();
    let fc: ChatFactory = new ChatFactory();
    
    let u1: User = fu.createRegularUser("https://i.imgur.com/zPFuLVO.jpeg","luisfc68","123","prueba@correo");
    return this.userDao.insert(u1).then(u => {

      console.log(u.favChats)
      let c = fc.createChat("s","s","s",u,["a"]);
      u1 = u;
      return this.chatDao.insert(c);
    })
    .then(chat => {
      u1.favChats.push(chat);
      return this.userDao.update(u1);
    })
    .then(res => res);
  }

  @Get("/plans")
  async planes():Promise<User[]>{
    
    let fu: UserFactory = new UserFactory();
    let premium = fu.createPremiumUser("https://i.imgur.com/zPFuLVO.jpeg","premium","123","correo1");
    let mid = fu.createMidUser("https://i.imgur.com/zPFuLVO.jpeg","mid","456","correo2");
    let normal = fu.createRegularUser("https://i.imgur.com/zPFuLVO.jpeg","normal","789","correo3");

    let res:User[] = [];

    return this.userDao.insert(premium)
      .then((p) => {
        res.push(p);
        return this.userDao.insert(mid);
      })
      .then((m) => {
        res.push(m);
        return this.userDao.insert(normal);
      })
      .then((n) => {
        res.push(n);
        res.forEach(u => {
          console.log(u.plan)
          console.log(u.plan.canCreateChat())
        })
        return res;
      });

  }

  @Get("/toPremium")
  async update(@QueryParams("id") id: string):Promise<User|null>{
    
    let u:User|null = await this.userDao.get(id);
    
    if(!u)
      return null;

    u.plan = new PremiumPlan(new Date());

    u = await this.userDao.update(u);

    console.log("IMP => "+(<any>u?.plan).implementation);
    console.log("PLAN => "+u?.plan.canCreateChat());

    return u;

  }

  @Get("/read")
  @Returns(200,User).Groups(AppGroups.USER)
  async read(@QueryParams("id") id: string):Promise<User|null>{
    
    let u:User|null = await this.userDao.get(id);

    if(!u)
      return null;

    console.log("IMP => "+(<any>u.plan).implementation);
    console.log("PLAN => "+u.plan.canCreateChat());

    return u;

  }

  @Get("/all")
  async all():Promise<User[]>{
    
    let u:User[] = await this.userDao.getAll(1);

    u.forEach(r => {
      console.log("IMP => "+(<any>r.plan).implementation);
      console.log("PLAN => "+r.plan.canCreateChat());
    });

    return u;

  }

  @Get("/delete")
  async delete(@QueryParams("id") id: string):Promise<User|null>{
    
    let u:User|null = await this.userDao.delete(id);

    if(!u)
      return null;

    console.log("IMP => "+(<any>u.plan).implementation);
    console.log("PLAN => "+u.plan.canCreateChat());

    return u;

  }

  @Get("/nullpremium")
  async nullpremium():Promise<User|null>{
    
    let fu: UserFactory = new UserFactory();

    let u:User|null = fu.createRegularUser("a","a","a","a",[],"6164a9b084f25f011712bdea");
    u = await this.userDao.update(u);

    if(!u)
      return null;

    console.log("IMP => "+(<any>u.plan).implementation);
    console.log("PLAN => "+u.plan.canCreateChat());

    return u;

  }

  @Get("/chat")
  @Returns(200,Chat).Groups("chatRepresentation")
  chat():Promise<Chat>{

    let cf: ChatFactory = new ChatFactory();
    let uf: UserFactory = new UserFactory();

    let u = uf.createRegularUser("test","test","test","test");
    
    let usuario:User;
    let chatCreado:Chat;

    return this.userDao.insert(u)
    .then(user => {
      usuario = user;
      let c = cf.createChat("mi-chat","test","test",user,["prueba","1","a"]);
      return this.chatDao.insert(c);
    })
    .then(chat => {
      chatCreado = chat;
      usuario.actualChat = chat;

      return this.chatDao.insertMessage(chatCreado,usuario.write("mensaje 1"));
    })
    .then(() => this.chatDao.insertMessage(chatCreado,usuario.write("mensaje 2"))
    .then(() => chatCreado));

  }

  @Get("/read-chat")
  @Returns(200,Chat).Groups("chatRepresentation")
  readChat(@QueryParams("id") id: string):Promise<Chat|null>{
    return this.chatDao.get(id)
    .then(chat =>{
      if(!chat) return null;
      console.log(chat.messages);
      return chat;
    })
  }

  @Get("/chat-clean")
  @Returns(200,Message).Groups(AppGroups.MSG)
  chatClean():Promise<Message[]>{

    let cf: ChatFactory = new ChatFactory();
    let uf: UserFactory = new UserFactory();

    let u = uf.createRegularUser("test","test","test","test");
    
    let usuario:User;
    let chatCreado:Chat;

    return this.userDao.insert(u)
    .then(user => {
      usuario = user;
      let c = cf.createChat("mi-chat","test","test",user,["prueba","1","a"]);
      return this.chatDao.insert(c);
    })
    .then(chat => {
      chatCreado = chat;
      usuario.actualChat = chat;

      return this.chatDao.insertMessage(chatCreado,usuario.write("mensaje 1"));
    })
    .then(() => this.chatDao.insertMessage(chatCreado,usuario.write("mensaje 2")))
    .then(() => this.chatDao.insertMessage(chatCreado,usuario.write("mensaje 3")))
    .then(() => this.chatDao.insertMessage(chatCreado,usuario.write("mensaje 4")))
    .then(() => this.chatDao.getMessages(chatCreado,1))
    .then(res => {
      console.log(res)
      return res
    });
    
  }

  @Get("/byname")
  @Returns(200,User).Groups(AppGroups.USER)
  userByName(@BodyParams("username") username:string):Promise<User|null>{
    return this.userDao.getByUsername(username);
  }

  @Post("/login")
  @Authenticate("login")
  @Returns(201,String)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login(@Req() req: Req, @Required() @BodyParams("username") _email: string, @Required() @BodyParams("password") _password: string) {
    //FUNCIONA COMO FACHADA DEL PROTOCOLO
    console.log(req.user)
    return req.user;
  }

  @Get("/usertoken")
  @Authorize("jwt")
  @Returns(200,User).Groups(AppGroups.USER)
  getWithToken(@Req() req: Req, @HeaderParams("authorization") _token: string){
    console.log(req.user)
    const id:string = <string>req.user;
    console.log(id);
    return this.userDao.get(id).then(r => {
      return r;
    });
  }


}