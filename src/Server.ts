import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import mongooseConfig from "./configurations/mongoose.config";
import controllersConfig from "./configurations/controllers.config";
import "./filters/CustomErrorFilter"
import cors from "cors";
import * as express from "express";

const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8080,
  mongoose: mongooseConfig,
  mount: controllersConfig
})
export class Server {

  @Inject()
  app!: PlatformApplication;

  @Configuration()
  settings!: Configuration;

  public $beforeRoutesInit(): void | Promise<any> {
    this.app.use(cors())
            .use(express.json())
            .use(express.urlencoded({
              extended: true
            }));
   
  }

}