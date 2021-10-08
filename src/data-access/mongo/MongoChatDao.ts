import { Inject, Service } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import Chat from "../../business-logic/entity/Chat";
import Message from "../../business-logic/entity/Message";
import { ChatDao } from "../da.interfaces";
import MongoEntityDao from "./MongoEntityDao";

@Service()
export default class MongoChatDao extends MongoEntityDao<Chat> implements ChatDao{


    constructor(
        @Inject(Chat) model:MongooseModel<Chat>
    ){
        super(model,{
            useFindAndModify: false
        });
    }

    update(obj: Chat): Promise<Chat|null> {

        const update = {
            _title: obj.title,
            _imgUrl: obj.imgUrl,
            _description: obj.description,
            _tags: obj.tags
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

    updateMessages(_m: Message): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}