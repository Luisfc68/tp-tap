import { SubscriptionPlan } from "../bl.interfaces";
import { Name, Property } from "@tsed/schema"
import { Model, MongoosePlugin } from "@tsed/mongoose";

@Model()
@MongoosePlugin(RegularPlan.resolve)
export default class RegularPlan implements SubscriptionPlan{

    @Property()
    @Name("haveCreatedChat")
    private _haveCreatedChat:boolean;

    static resolve = () => RegularPlan;

    constructor(_haveCreatedChat:boolean){
        this._haveCreatedChat = _haveCreatedChat;
    }

    registerChatCreation(): void {
        this._haveCreatedChat = true;  
    }

    canCreateChat(): boolean {
        return !this._haveCreatedChat;
    }
    
}