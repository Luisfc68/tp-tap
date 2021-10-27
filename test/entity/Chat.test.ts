import User from "../../src/business-logic/entity/User";
import UserFactory from "../../src/business-logic/factory/UserFactory";
import Chat from "../../src/business-logic/entity/Chat";
import ChatFactory from "../../src/business-logic/factory/ChatFactory";



describe ('test de chat', () => {

    const userFactory = new UserFactory();
    const chatFactory = new ChatFactory();

    let user1:User;
    let user2:User;
    let chat1:Chat;
    let chat2:Chat;

    beforeEach(() => {
        user1 = userFactory.createRegularUser("luisfc68","elpepe69","luis@correo");
        user2 = userFactory.createRegularUser("caminante","pizza","sol@correo");
        chat1 = chatFactory.createChat("Mundo Anime", "Hablemos de anime", user1);
        chat2 = chatFactory.createChat("Mundo Pop", "Hablemos de popstars", user2);

    });

    it ("eliminar los mensajes del user1", () => {

        chat1.addUser(user1);
        chat1.addUser(user2);
        chat1.newMessage(user1.write("holaaa"));
        chat1.newMessage(user2.write("hola!"));
        chat1.newMessage(user1.write("como estass"));
        chat1.newMessage(user2.write("todo bn vos?"));
        
        chat1.cleanMessages(user1);

        expect(chat1.messages.length).toBe(2);

    });

    it ("Corroborar que el user1 esté en el último grupo ingresado", () => {

        chat1.addUser(user1);
        chat2.addUser(user1);
    
        expect(user1.actualChat?.title).toBe(chat2.title);
        expect(chat2.connectedUsers).toBe(1);
        expect(chat1.connectedUsers).toBe(0);
    });

    it ("Corroborar que el remove saque al user1 del grupo actual", () => {

        chat1.addUser(user1);
        chat1.removeUser(user1);

        expect(user1.actualChat).toBeNull();

    });

})