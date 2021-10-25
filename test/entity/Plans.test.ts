import User from "../../src/business-logic/entity/User";
import UserFactory from "../../src/business-logic/factory/UserFactory";
import ChatFactory from "../../src/business-logic/factory/ChatFactory";
import PlanFactory from "../../src/business-logic/factory/PlanFactory";
import MidPlan from "../../src/business-logic/entity/MidPlan";
import Chat from "../../src/business-logic/entity/Chat";

describe('Test de planes',()=>{

    const userFactory = new UserFactory();
    const chatFactory = new ChatFactory();
    const planFactory = new PlanFactory();

    let user:User;

    beforeAll(() => {
        user = userFactory.createRegularUser("luisfc68","elpepe69","luis@correo");
    });

    describe("Test de plan regular", () => {

        it("Crea un chat", () => {
            let chat = chatFactory.createChatUsingSubscription("chat 1","descripcion 1",user);
            expect(chat).not.toBeNull();
        });

        it("Ya no puede crear mas chats", () => {
            expect(() => chatFactory.createChatUsingSubscription("chat 1","descripcion 1",user)).toThrow();
        });

    });

    describe("Test de plan medio",() => {

        it("Crea 5 chats", () => {
            user.plan = planFactory.createMidPlan();

            let chats:Chat[] = [];

            for(let i = 0; i<MidPlan.MAX_CHATS_MIDPLAN; i++)
                chats.push(chatFactory.createChatUsingSubscription('chat-'+i,"cualquier descripcion",user));
            
            chats = chats.filter((c) => c !== null && c !== undefined);
            expect(chats.length).toBe(MidPlan.MAX_CHATS_MIDPLAN);
            
        });  
        
        it("No puede crear sexto chat", () => {
            expect(() => chatFactory.createChatUsingSubscription("chat 6","descripcion 6",user)).toThrow();
        });

    });

    describe("Test de plan premium", () => {

        it("Crea 20 chats con el vencimiento del plan en un mes", () => {

            const cantidadPrueba = 20;

            user.plan = planFactory.createPremiumPlan();

            let chats:Chat[] = [];

            for(let i = 0; i<cantidadPrueba; i++)
                chats.push(chatFactory.createChatUsingSubscription('chat-'+i,"cualquier descripcion",user));
            
            chats = chats.filter((c) => c !== null && c !== undefined);
            expect(chats.length).toBe(cantidadPrueba);

        });

        it("No puede crear planes si el plan se vencio hace unos segundos",async () => {

            user.plan = planFactory.createPremiumPlan(new Date());

            await setTimeout(()=>{},4000); //espera para que se venza el plan

            expect(() => chatFactory.createChatUsingSubscription("chat 6","descripcion 6",user)).toThrow();
        });

    });

});