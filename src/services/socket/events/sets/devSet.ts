import { EventConstructor } from "../../socket.interfaces";
import CleanLeave from "../implementations/CleanLeave";
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
    MessageSent,
    CleanLeave
];

export default devEvents;