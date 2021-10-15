import { Inject, Service } from "@tsed/di";
import { MongooseModel } from "@tsed/mongoose";
import Chat from "../../business-logic/entity/Chat";
import Message from "../../business-logic/entity/Message";
import User from "../../business-logic/entity/User";
import { ChatDao, MESSAGE_LIMIT } from "../da.interfaces";
import MongoEntityDao from "./MongoEntityDao";
import { Types } from "mongoose";
import DaoError from "../../errors/DaoError";

@Service()
export default class MongoChatDao extends MongoEntityDao<Chat> implements ChatDao{


    constructor(
        @Inject(Chat) model:MongooseModel<Chat>
    ){
        super(model,
        {
            useFindAndModify: false
        },["_owner"],"-_messages");
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
        return  super.model.findByIdAndUpdate(obj.id,update,ops)
                .select(super.selection)
                .populate(super.populatedFields.join(" "))
                .then(obj => obj?.toClass() || null)
                .catch(err => {
                    console.error(err);
                    throw new DaoError("Error updating document");
                });
    }

    insertMessage(chat: Chat, message: Message): Promise<Message|null> {

        const update = {
            $push: {
                _messages: message
            }
        }

        return this.model.findByIdAndUpdate(chat.id,update,super.generalOps)
               .select(super.selection)
               .then(chat => (chat)? message : null)
               .catch(err => {
                    console.error(err);
                    throw new DaoError("Error saving message");
               });
    }

    cleanMessages(chat: Chat, user: User): Promise<boolean> {

        const update = {
            $pull: {
                _messages: {
                    _user: user.id
                }
            }
        }

        return this.model.findByIdAndUpdate(chat.id,update,super.generalOps)
               .select(super.selection)
               .then(chat => (chat)? true : false)
               .catch(err => {
                    console.error(err);
                    throw new DaoError("Error cleaning user messages");
               });
    }

    getMessages(chat: Chat, offset: number = 0): Promise<Message[]> {

        const pipeline = [
            {
                $match: {
                    _id: Types.ObjectId(chat.id)
                } 
            },
            {
                $project:{
                    _id: false,
                    _messages: {
                        $slice: ["$_messages",offset,MESSAGE_LIMIT]
                    }
                }
            }
        ];

        return  this.model.aggregate(pipeline)
                .then(res => this.model.populate(res,{path: "_messages._user"}))
                .then(res => {

                    if(res.length !== 1)
                        throw new DaoError("Error finding chat");

                    console.log(res)

                    return (<any>res[0])._messages; //Hay que devolverlo así porque el aggregate no lo mapea directo,
                });                                //entonces el populate devuelve un documento que no está mapeado a la clase
    }

}