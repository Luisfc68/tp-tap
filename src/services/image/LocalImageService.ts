import ImageService from "./ImageService";
import { existsSync, mkdirSync, writeFileSync,createReadStream, ReadStream } from "fs"; 
import { PlatformMulterFile } from "@tsed/common";

export default class LocalImageService extends ImageService{
    
    
    saveImage(id: string,group: string, img: PlatformMulterFile): Promise<string> {

        try{
            if(!super.acceptedMimes.includes(img.mimetype))
            throw new Error("Not valid extension");

            let extesion = this.getExtension(img);
            let path = `image/${group}/`;
            let file = `${id}.${extesion}`;

            if(!existsSync(path))
                mkdirSync(path,{ recursive: true });
            writeFileSync(path+file,img.buffer);
            
            return Promise.resolve(path+file); //Se devuelven de esta manera porque esta es la unica implementacion sincronica
        }catch(e:any){
            return Promise.reject(e);
        }
    }

    getImage(path: string,_group:string):ReadStream{
        if(existsSync(path))
            return createReadStream(path);
        else
            throw new Error("Image not found");
    }

    private getExtension(img: PlatformMulterFile):string{
        return img.mimetype.split("/")[1];
    }

}