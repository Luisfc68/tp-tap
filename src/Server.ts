import {Configuration, Inject, PlatformApplication} from "@tsed/common";

const rootDir = __dirname;

@Configuration({
  rootDir,
  acceptMimes: ["application/json"],
  mongoose: [
    {
        id: process.env.DB_ID!,
        url: process.env.DB_URL!
    }
  ]
})
export class Server {

  @Inject()
  app!: PlatformApplication;

  @Configuration()
  settings!: Configuration;

  /**
   * This method let you configure the express middleware required by your application to works.
   * @returns {Server}
   */
  /*public $beforeRoutesInit(): void | Promise<any> {
  }*/

}