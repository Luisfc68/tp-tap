export enum SocketEvents{
    ERROR="error",
    DISCONECT="disconnect",
    JOIN_ROOM="joinRoom",
    CHAT_REQUEST="chatRequest",
    MSG_REQUEST="msgRequest",
    LEAVE_ROOM="leaveRoom",
    MSG_SENT="msgSent",
    CLEAN_LEAVE="cleanLeaveRoom",
    CONNECTION_SUCCESS="connectionSuccess",
    ADD_FAV_CHAT="addFavChat",
    RM_FAV_CHAT="rmFavChat",
    JOIN_CONFIRM="joinConfirm",
    //Estos son eventos que no se generan en tiempo real
    //el servidor los genera, no los responde, por eso no tienen handler
    USER_CHANGED="userChanged",
    CHAT_CHANGED="chatChanged"

}