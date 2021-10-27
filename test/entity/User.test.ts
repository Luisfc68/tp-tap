
import User from "../../src/business-logic/entity/User";
import UserFactory from "../../src/business-logic/factory/UserFactory";
import Chat from "../../src/business-logic/entity/Chat";
import ChatFactory from "../../src/business-logic/factory/ChatFactory";

describe ('test de user', () => {

    const userFactory = new UserFactory();
    const chatFactory = new ChatFactory();

    let user1:User;
    let user2:User;
    let chat1:Chat;
    let chat2:Chat;


    beforeAll(() => {
        user1 = userFactory.createRegularUser("luisfc68","elpepe69","luis@correo");
        chat1 = chatFactory.createChat("Mundo Anime", "Hablemos de anime", user1);
        user2 = userFactory.createRegularUser("caminante","pizza","sol@correo");
        chat2 = chatFactory.createChat("Mundo Pop", "Hablemos de popstars", user2);

    });

    it ('el usuario sale del chat sin eliminar mensajes', () => {

        chat1.addUser(user1);
        chat1.newMessage(user1.write("holiwis"));
        chat1.newMessage(user1.write("como estas amigui"));
        user1.leaveChat();

        expect(chat1.messages.length).toStrictEqual(2); 
        expect(user1.actualChat).toBeNull();
        expect(chat1.connectedUsers).toStrictEqual(0);

    });
    
    it ('el usuario sale del chat y elimina los mensajes antes', () => {

        chat1.addUser(user1);
        chat1.newMessage(user1.write("holas"));
        chat1.newMessage(user2.write("holi"));
        chat1.newMessage(user1.write("como va"));
        chat1.newMessage(user2.write("todo bien!"));
        chat1.newMessage(user2.write("y vos?"));

        user1.cleanLeaveChat();

        expect(chat1.messages.length).toStrictEqual(3);

    });
    
    it ('el usuario selecciona un chat favorito', () => {

        user1.addFavChat(chat1);
        user1.addFavChat(chat2);
        user1.addFavChat(chat1);

        expect(user1.favChats.length).toStrictEqual(2);

    });

    it ('el usuario selecciona un chat fav y luego lo saca de favs', () => {

        user1.addFavChat(chat1);
        user1.addFavChat(chat2);
        user1.removeFavChat(chat1);
        user1.removeFavChat(chat1);

        let expectedTitle = (<Chat>user1.favChats[0]).title;
        expect(expectedTitle).toBe(chat2.title);

    });

});
