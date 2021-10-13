import {Configuration, Inject, PlatformApplication} from "@tsed/common";
import mongooseConfig from "./configurations/mongoose.config";
import cors from "cors";

const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8080,
  mongoose: mongooseConfig
  
})
export class Server {

  @Inject()
  app!: PlatformApplication;

  @Configuration()
  settings!: Configuration;

  public $beforeRoutesInit(): void | Promise<any> {
    this.app.use(cors());
  }

}