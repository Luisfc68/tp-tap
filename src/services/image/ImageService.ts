import { PlatformMulterFile } from "@tsed/common";

export default abstract class ImageService{

    private readonly _acceptedMimes = [
        "image/jpeg",
        "image/png"
    ];

    abstract saveImage(id:string,group:string,img:PlatformMulterFile):Promise<string>;
    //dependiendo de la implementacion la imagen se puede devolver con diferentes clases
    abstract getImage(path:string,group:string):any; 

    get acceptedMimes(){
        return this._acceptedMimes;
    }

}
