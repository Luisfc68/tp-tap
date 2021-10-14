import { MongooseModel } from "@tsed/mongoose";
import { QueryOptions } from "mongoose";
import DaoError from "../../errors/DaoError";
import { ErrorModifiers } from "../../errors/errorEnum";
import { Dao, PAGE_LIMIT } from "../da.interfaces";

export default abstract class MongoEntityDao<T> implements Dao<T>{

    constructor(
        private readonly _model:MongooseModel<T>,
        private readonly _generalOps:QueryOptions,
        private readonly _populatedFields:string[],
        private readonly _selection:string = ""
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

    get selection(){
        return this._selection;
    }

    insert(param: T): Promise<T> {
        return  this._model.create(param)
                .then(obj => {
                    return this._model.populate(obj,
                        { path: this.populatedFields.join(" ") });
                })
                .then(obj => obj.toClass())
                .catch(err => {
                    if(err.code === 11000)
                        throw new DaoError("Duplicated value for key or index",ErrorModifiers.DUP_KEY);
                    console.error(err);
                    throw new DaoError("Error inserting document");
                });
    }

    abstract update(obj: T): Promise<T | null>;

    delete(id: string): Promise<T|null> {
        return  this._model.findByIdAndDelete(id,this._generalOps)
                .select(this._selection)
                .populate(this.populatedFields.join(" "))
                .then(obj => obj?.toClass() || null)
                .catch( err =>{
                    console.error(err);
                    throw new DaoError("Error deleting document");
                });
    }

    get(id: string): Promise<T|null> {
        return this._model.findById(id)
               .select(this._selection)
               .populate(this.populatedFields.join(" "))
               .exec()
               .then(obj => {
                    return obj?.toClass() || null;
               });
    }

    getAll(offset:number = 0): Promise<T[]> {
        return this._model.find()
               .select(this._selection)
               .skip(offset)
               .limit(PAGE_LIMIT)
               .populate(this.populatedFields.join(" "))
               .exec()
               .then(arr => arr.map(obj => obj.toClass()));
    }
    
}