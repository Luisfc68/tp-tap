import { MongooseModel } from "@tsed/mongoose";
import { QueryOptions } from "mongoose";
import { Dao, PAGE_LIMIT } from "../da.interfaces";

export default abstract class MongoEntityDao<T> implements Dao<T>{

    constructor(
        private readonly _model:MongooseModel<T>,
        private readonly _generalOps:QueryOptions,
        private readonly _populatedFields:string[]
    ){}

    get model(){
        return this._model;
    }

    get generalOps(){
        return this._generalOps;
    }

    get populatedFields(){
        return this._populatedFields;
    }

    insert(param: T): Promise<T> {
        return  this._model.create(param)
                .then(obj => {
                    return this._model.populate(obj,
                        { path: this.populatedFields.join(" ") });
                })
                .then(obj => obj.toClass())
                .catch(err => {
                    console.error(err);
                    throw new Error("Error inserting document");
                });
    }

    abstract update(obj: T): Promise<T | null>;

    delete(id: string): Promise<T|null> {
        return  this._model.findByIdAndDelete(id,this._generalOps)
                .populate(this.populatedFields.join(" "))
                .then(obj => obj?.toClass() || null)
                .catch( err =>{
                    console.error(err);
                    throw new Error("Error deleting document");
                });
    }

    get(id: string): Promise<T|null> {
        return this._model.findById(id)
               .populate(this.populatedFields.join(" "))
               .exec()
               .then(obj => {
                    return obj?.toClass() || null;
               });
    }

    getAll(offset:number = 0): Promise<T[]> {
        return this._model.find()
               .skip(offset)
               .limit(PAGE_LIMIT)
               .populate(this.populatedFields.join(" "))
               .exec()
               .then(arr => arr.map(obj => obj.toClass()));
    }
    
}