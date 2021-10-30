export enum SocketEvents{
    ERROR="error",
    DISCONECT="disconnect",
    JOIN_ROOM="join-room",
    CHAT_REQUEST="chat-request",
    MSG_REQUEST="msg-request",
    LEAVE_ROOM="leave-room",
    MSG_SENT="msg-sent",
    CLEAN_LEAVE="clean-leave-room",
    CONNECTION_SUCCESS="connection-success",
    ADD_FAV_CHAT="add-fav-chat",
    RM_FAV_CHAT="rm-fav-chat",
    //Estos son eventos que no se generan en tiempo real
    //el servidor los genera, no los responde, por eso no tienen handler
    USER_CHANGED="user-changed",
    CHAT_CHANGED="chat-changed"

}