import { MongooseModel } from "@tsed/mongoose";
import { EnforceDocument, QueryOptions } from "mongoose";
import { Dao, PAGE_LIMIT } from "../da.interfaces";

export default abstract class MongoEntityDao<T> implements Dao<T>{

    private readonly _populatedFields:string[];

    constructor(
        private readonly _model:MongooseModel<T>,
        private readonly _generalOps:QueryOptions,
        ...populatedFields:string[]
    ){
        this._populatedFields = populatedFields;
    }

    get model(){
        return this._model;
    }

    get generalOps(){
        return this._generalOps;
    }

    get populatedFields(){
        return this._populatedFields;
    }

    protected populate(obj:EnforceDocument<T,any>):void{
        this._populatedFields.forEach(field => obj.populate(field));
    }

    insert(obj: T): Promise<T> {
        return  this._model.create(obj)
                .then(obj => {
                    this.populate(obj);
                    return obj.toClass();
                })
                .catch(err => {
                    console.error(err);
                    throw new Error("Error inserting document");
                });
    }

    abstract update(obj: T): Promise<T | null>;

    delete(id: string): Promise<T|null> {
        return  this._model.findByIdAndDelete(id,this._generalOps)
                .then(obj => {
                    if(obj)
                        this.populate(obj);
                    return obj?.toClass() || null;
                })
                .catch( err =>{
                    console.error(err);
                    throw new Error("Error deleting document");
                });
    }

    get(id: string): Promise<T|null> {
        return this._model.findById(id)
               .exec()
               .then(obj => {
                    if(obj)
                        this.populate(obj);
                    return obj?.toClass() || null;
               });
    }

    getAll(offset:number = 0): Promise<T[]> {
        return this._model.find()
               .skip(offset)
               .limit(PAGE_LIMIT)
               .exec()
               .then(arr => {
                    arr.forEach(obj => this.populate(obj));
                    return arr.map(obj => obj.toClass());
                });
    }
    
}