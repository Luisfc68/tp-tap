import { EventConstructor } from "../../socket.interfaces";
import UserDisconnected from "../implementations/UserDisconnected";

const devEvents:EventConstructor[] = [
    UserDisconnected
];

export default devEvents;