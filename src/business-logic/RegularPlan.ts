import { SubscriptionPlan } from "./bl.interfaces";

export default class RegularPlan implements SubscriptionPlan{

    constructor(
        private _haveCreatedChat:boolean
    ){}

    registerChatCreation(): void {
        this._haveCreatedChat = true;  
    }

    canCreateChat(): boolean {
        return !this._haveCreatedChat;
    }
    
}