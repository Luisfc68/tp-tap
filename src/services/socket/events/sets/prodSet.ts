import { EventConstructor } from "../../socket.interfaces";
import UserDisconnected from "../implementations/UserDisconnected";

const prodEvents:EventConstructor[] = [
    UserDisconnected
];

export default prodEvents;