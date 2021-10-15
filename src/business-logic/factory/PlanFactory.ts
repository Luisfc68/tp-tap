import { Injectable } from "@tsed/di";
import { SubscriptionPlan } from "../bl.interfaces";
import MidPlan from "../entity/MidPlan";
import PremiumPlan from "../entity/PremiumPlan";
import RegularPlan from "../entity/RegularPlan";

@Injectable()
export default class PlanFactory{
    
    createRegularPlan():SubscriptionPlan{
        return new RegularPlan(false);
    }

    createMidPlan(createdChats = 0):SubscriptionPlan{
        return new MidPlan(createdChats);
    }

    createPremiumPlan(endDate:Date = new Date()){
        return new PremiumPlan(endDate);
    }

}