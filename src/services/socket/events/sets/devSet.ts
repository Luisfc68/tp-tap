import { EventConstructor } from "../../socket.interfaces";
import JoinRoom from "../implementations/JoinRoom";
import LeaveRoom from "../implementations/LeaveRoom";
import MessageRequest from "../implementations/MessageRequest";
import MessageSent from "../implementations/MessageSent";
import UserDisconnected from "../implementations/UserDisconnected";

const devEvents:EventConstructor[] = [
    UserDisconnected,
    JoinRoom,
    MessageRequest,
    LeaveRoom,
    MessageSent
];

export default devEvents;