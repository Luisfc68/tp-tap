import { SubscriptionPlan } from "./bl.interfaces";

export default class MidPlan implements SubscriptionPlan{
    
    static readonly MAX_CHATS_MIDPLAN:number = 5;

    constructor(
        private _createdChats:number
    ) {}

    registerChatCreation(): void {
        this._createdChats++;
    }

    canCreateChat(): boolean {
        return this._createdChats<MidPlan.MAX_CHATS_MIDPLAN;
    }
}