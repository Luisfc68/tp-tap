import Chat from "../../business-logic/entity/Chat";
import Message from "../../business-logic/entity/Message";
import { ChatDao } from "../da.interfaces";

export default class MongoChatDao implements ChatDao{

    insert(_o: Chat): Promise<Chat> {
        throw new Error("Method not implemented.");
    }
    update(_o: Chat): Promise<Chat> {
        throw new Error("Method not implemented.");
    }
    delete(_id: string): Promise<Chat> {
        throw new Error("Method not implemented.");
    }
    get(_id: string): Promise<Chat> {
        throw new Error("Method not implemented.");
    }
    getAll(_offset: number): Promise<Chat[]> {
        throw new Error("Method not implemented.");
    }
    updateMessages(_m: Message): Promise<boolean> {
        throw new Error("Method not implemented.");
    }

}