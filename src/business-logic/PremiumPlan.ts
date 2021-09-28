import { SubscriptionPlan } from "./bl.interfaces";

export default class PremiumPlan implements SubscriptionPlan {

    constructor(
        private _endDate:Date
    ) {}

    canCreateChat(): boolean {
        return this._endDate>new Date();
    }

    //No aplica
    registerChatCreation(): void {}

}