import { SubscriptionPlan } from "../bl.interfaces";
import Chat from "../entity/Chat";
import MidPlan from "../entity/MidPlan";
import PremiumPlan from "../entity/PremiumPlan";
import RegularPlan from "../entity/RegularPlan";
import User from "../entity/User";

export default class UserFactory{

    private createUser(imgUrl:string, username:string, password:string,email: string,
        plan:SubscriptionPlan,favChats?:Set<Chat>,id?:string):User{

            return new User(imgUrl,username,password,email,plan,favChats,id);
    }

    createRegularUser(imgUrl:string, username:string, password:string,
        email: string,favChats?:Set<Chat>,id?:string):User{

            return this.createUser(imgUrl,username,password,email,new RegularPlan(false),favChats,id);
    }
    
    createMidUser(imgUrl:string, username:string, password:string,
        email: string,favChats?:Set<Chat>,id?:string):User{

            return this.createUser(imgUrl,username,password,email,new MidPlan(0),favChats,id);
    }

    createPremiumUser(imgUrl:string, username:string, password:string,
        email: string,favChats?:Set<Chat>,id?:string):User{

            let endDate = new Date();
            endDate.setMonth(endDate.getMonth()+1); //Un mes en el futuro

            return this.createUser(imgUrl,username,password,email,new PremiumPlan(endDate),favChats,id);
    }


}