import { Inject } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import User from "../../business-logic/entity/User";
import { UserDao } from "../da.interfaces";
import MongoEntityDao from "./MongoEntityDao";
import * as Mongoose from "mongoose";

export default class MongoUserDao extends MongoEntityDao<User> implements UserDao{

    constructor(
        @Inject(User) model:MongooseModel<User>
    ){
        super(model,
        {
            useFindAndModify: false
        },["_favChats"]);
    }

    update(param: User): Promise<User|null> {

        const update = {
            _imgUrl: param.imgUrl,
            _username: param.username,
            _password: param.password,
            _email: param.email,
            _favChats: param.favChats,
            _plan: param.plan
        };

        const ops = {
            new: true,
            ...super.generalOps
        };
       
        return  super.model.findByIdAndUpdate(param.id,update,ops)
                .then((obj) => {
                    if(!obj)
                        return null;
                    return this.savePlanImplementation(param);
                })
                .catch(err => {
                    console.error(err);
                    throw new Error("Error updating document");
                });
    }

    
    insert(obj:User):Promise<User>{
        return super.insert(obj).then(u => {
            return this.savePlanImplementation(u);
        })
        .catch(err => {
            console.log(err);
            throw new Error("Error inserting document");
        });
    }

    get(id:string):Promise<User|null>{
        return super.get(id).then(u => {
            if(!u)
                return null;
            this.loadPlanImplementation(u);
            return u;
        })
        .catch( err => {
            console.log(err);
            throw new Error("Error determinating susbcription plan");
        });
    }

    getAll(offset:number = 0):Promise<User[]>{
        return super.getAll(offset)
               .then(res => {
                   res.forEach(u => this.loadPlanImplementation(u));
                   return res;
               })
               .catch(err => {
                    console.log(err);
                    throw new Error("Error determinating susbcription plan");
                });
    }

    delete(id:string):Promise<User|null>{
        return super.delete(id).then(u => {
            if(!u)
                return null;
            this.loadPlanImplementation(u);
            return u;
        })
        .catch( err => {
            console.log(err);
            throw new Error("Error determinating susbcription plan");
        });
    }

    //Guarda la implementacion de SubscriptionPlan para parsear al extraer de la base
    private savePlanImplementation(u :User):Promise<User>{
        return super.model.findByIdAndUpdate(u.id,
            { 
                $set: { "_plan.implementation" : u.plan.constructor.name} 
            },
            super.generalOps)
        .then(doc => {
            if(!doc)
                throw new Error("Error saving subscription plan");
            return u;
        });
    }

    //Parsea la implementacion guardada y borra la propiedad en la que se guardo
    private loadPlanImplementation(u :User){

        const implementation:string = (<any>u.plan).implementation;
        const model:any = Mongoose.model(implementation);

        if(delete (<any>u.plan).implementation && model)
            Object.setPrototypeOf(u.plan,model.resolve().prototype);
    }

}