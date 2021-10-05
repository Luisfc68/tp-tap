import User from "../../business-logic/entity/User";
import { UserDao } from "../da.interfaces";

export default class MongoUserDao implements UserDao{

    insert(_o: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    update(_o: User): Promise<User> {
        throw new Error("Method not implemented.");
    }
    delete(_id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    get(_id: string): Promise<User> {
        throw new Error("Method not implemented.");
    }
    getAll(_offset: number): Promise<User[]> {
        throw new Error("Method not implemented.");
    }

}