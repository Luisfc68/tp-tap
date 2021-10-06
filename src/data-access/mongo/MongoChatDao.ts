import { Inject, Service } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import { UpdateQuery, UpdateWithAggregationPipeline } from "mongoose";
import Chat from "../../business-logic/entity/Chat";
import Message from "../../business-logic/entity/Message";
import { ChatDao, PAGE_LIMIT } from "../da.interfaces";

@Service()
export default class MongoChatDao implements ChatDao{

    private readonly generalOps = {
        useFindAndModify: false
    };

    constructor(
        @Inject(Chat) private model:MongooseModel<Chat>
    ){}

    insert(o: Chat): Promise<Chat> {
        return  this.model.create(o)
                .catch(err => {
                    console.error(err);
                    throw new Error("Error inserting document");
                });
    }

    update(o: Chat): Promise<Chat|null> {

        const update = {
            _title: o.title,
            _imgUrl: o.imgUrl,
            _description: o.description,
            _tags: o.tags
        };

        const ops = {
            new: true,
            ...this.generalOps
        };
       
        return  this.model.findByIdAndUpdate(o.id,[{ $set: update }],ops)
                .catch(err => {
                    console.error(err);
                    throw new Error("Error updating document");
                });
    }

    delete(id: string): Promise<Chat|null> {
        return  this.model.findByIdAndDelete(id,this.generalOps)
                .catch( err =>{
                    console.error(err);
                    throw new Error("Error deleting document");
                });
    }
    
    get(id: string): Promise<Chat|null> {
        throw this.model.findById(id).exec();
    }

    getAll(offset:number = 0): Promise<Chat[]> {
        return this.model.find()
                         .skip(offset)
                         .limit(PAGE_LIMIT)
                         .exec();
    }

    updateMessages(_m: Message): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}