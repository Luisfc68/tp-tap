import { SubscriptionPlan } from "../bl.interfaces";
import { Model, MongoosePlugin } from "@tsed/mongoose";
import { Name, Property } from "@tsed/schema";

@Model()
@MongoosePlugin(MidPlan.resolve)
export default class MidPlan implements SubscriptionPlan{
    
    
    @Property()
    @Name("createdChats")
    private _createdChats:number;
    
    static readonly MAX_CHATS_MIDPLAN:number = 5;
    static resolve = () => MidPlan;

    constructor(_createdChats:number) {
        this._createdChats = _createdChats;
    }

    registerChatCreation(): void {
        this._createdChats++;
    }

    canCreateChat(): boolean {
        return this._createdChats<MidPlan.MAX_CHATS_MIDPLAN;
    }
}