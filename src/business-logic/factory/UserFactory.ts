import { Injectable } from "@tsed/di";
import { SubscriptionPlan } from "../bl.interfaces";
import Chat from "../entity/Chat";
import MidPlan from "../entity/MidPlan";
import PremiumPlan from "../entity/PremiumPlan";
import RegularPlan from "../entity/RegularPlan";
import User from "../entity/User";

@Injectable()
export default class UserFactory{

    private createUser(username:string, password:string,email: string,
        plan:SubscriptionPlan,imgUrl?:string,favChats?:Chat[],id?:string):User{

            return new User(username,password,email,plan,imgUrl,favChats,id);
    }

    createRegularUser(username:string, password:string,
        email: string,imgUrl?:string,favChats?:Chat[],id?:string):User{

            return this.createUser(username,password,email,new RegularPlan(false),imgUrl,favChats,id);
    }
    
    createMidUser(username:string, password:string,
        email: string,imgUrl?:string, favChats?:Chat[],id?:string):User{

            return this.createUser(username,password,email,new MidPlan(0),imgUrl,favChats,id);
    }

    createPremiumUser(username:string, password:string,
        email: string,imgUrl?:string,favChats?:Chat[],id?:string):User{

            let endDate = new Date();
            endDate.setMonth(endDate.getMonth()+1); //Un mes en el futuro

            return this.createUser(username,password,email,new PremiumPlan(endDate),imgUrl,favChats,id);
    }


}