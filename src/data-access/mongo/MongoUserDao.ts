import { Inject } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import User from "../../business-logic/entity/User";
import { UserDao } from "../da.interfaces";
import MongoEntityDao from "./MongoEntityDao";

export default class MongoUserDao extends MongoEntityDao<User> implements UserDao{

    constructor(
        @Inject(User) model:MongooseModel<User>
    ){
        super(model,{
            useFindAndModify: false
        });
    }

    update(obj: User): Promise<User|null> {
        // TODO agregar para que actualice plan
        const update = {
            _imgUrl: obj.imgUrl,
            _username: obj.username,
            _password: obj.password,
            _email: obj.email,
            _favChats: obj.favChats
        };

        const ops = {
            new: true,
            ...super.generalOps
        };
       
        return  super.model.findByIdAndUpdate(obj.id,[{ $set: update }],ops)
                .then(obj => {
                    if(obj)
                        super.populate(obj);
                    return obj?.toClass() || null;
                })
                .catch(err => {
                    console.error(err);
                    throw new Error("Error updating document");
                });
    }

}