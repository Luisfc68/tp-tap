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

    createPremiumPlan(paramDate?:Date):SubscriptionPlan{
        if(paramDate)
            return new PremiumPlan(paramDate);
        
        let endDate = new Date();
        endDate.setMonth(endDate.getMonth()+1); 
        return new PremiumPlan(endDate);
    }

}