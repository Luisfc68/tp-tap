import { Inject, Service } from "@tsed/di";
import { MongooseModel, MongooseService } from "@tsed/mongoose";
import { Connection } from "mongoose";
import Chat from "../business-logic/entity/Chat";
import User from "../business-logic/entity/User";

@Service()
export default class MyService{

    private conn: Connection|undefined;
    private modelo: MongooseModel<User>;
    private modeloChat: MongooseModel<Chat>;

    constructor(m: MongooseService,
        @Inject(User) modelo: MongooseModel<User>,
        @Inject(Chat) modeloChat: MongooseModel<Chat>
    ) {
        this.conn = m.get(); // OR mongooseService.get("default");
        this.conn?.once("open", () => console.log("DB CONECTADA"));
        this.modelo = modelo
        this.modeloChat = modeloChat
    }

    guardar(u:User):Promise<User>{
        return this.modelo.create(u);
    }

    guardarChat(u:Chat):Promise<Chat>{
        
        return this.modeloChat.create(u);

    }

    leer(_username:string){
        return this.modelo.find({_username} as any).exec();
    }

    updateUser(u:User){
        return this.modelo.updateOne(<undefined><unknown>{_id: u.id},{ _favChats: u.favChats } as any)
    }

}