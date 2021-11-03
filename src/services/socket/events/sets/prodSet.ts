import { EventConstructor } from "../../socket.interfaces";
import AddFavChat from "../implementations/AddFavChat";
import ChatRequest from "../implementations/ChatRequest";
import CleanLeave from "../implementations/CleanLeave";
import JoinRoom from "../implementations/JoinRoom";
import LeaveRoom from "../implementations/LeaveRoom";
import MessageRequest from "../implementations/MessageRequest";
import MessageSent from "../implementations/MessageSent";
import RmFavChat from "../implementations/RmFavChat";
import UserDisconnected from "../implementations/UserDisconnected";

const prodEvents:EventConstructor[] = [
    UserDisconnected,
    JoinRoom,
    MessageRequest,
    LeaveRoom,
    MessageSent,
    CleanLeave,
    ChatRequest,
    AddFavChat,
    RmFavChat
];

export default prodEvents;