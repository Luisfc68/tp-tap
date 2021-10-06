import { MongooseModel } from "@tsed/mongoose";
import { QueryOptions } from "mongoose";
import { Dao, PAGE_LIMIT } from "../da.interfaces";

export default abstract class MongoEntityDao<T> implements Dao<T>{

    constructor(
        private readonly _model:MongooseModel<T>,
        private readonly _generalOps:QueryOptions
    ){}

    get model(){
        return this._model;
    }

    get generalOps(){
        return this._generalOps;
    }

    insert(o: T): Promise<T> {
        return  this._model.create(o)
                .catch(err => {
                    console.error(err);
                    throw new Error("Error inserting document");
                });
    }

    abstract update(o: T): Promise<T | null>;

    delete(id: string): Promise<T|null> {
        return  this._model.findByIdAndDelete(id,this._generalOps)
                .catch( err =>{
                    console.error(err);
                    throw new Error("Error deleting document");
                });
    }

    get(id: string): Promise<T|null> {
        throw this._model.findById(id).exec();
    }

    getAll(offset:number = 0): Promise<T[]> {
        return this._model.find()
                         .skip(offset)
                         .limit(PAGE_LIMIT)
                         .exec();
    }
    
}