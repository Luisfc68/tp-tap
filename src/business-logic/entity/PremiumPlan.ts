import { Model, MongoosePlugin } from "@tsed/mongoose";
import { Name, Property } from "@tsed/schema";
import { SubscriptionPlan } from "../bl.interfaces";


@Model()
@MongoosePlugin(PremiumPlan.resolve)
export default class PremiumPlan implements SubscriptionPlan {

    @Property()
    @Name("endDate")
    private _endDate:Date

    static resolve = () => PremiumPlan;

    constructor(_endDate:Date) {
        this._endDate = _endDate;
    }

    canCreateChat(): boolean {
        return this._endDate>new Date();
    }

    //No aplica
    registerChatCreation(): void {}

}