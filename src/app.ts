import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";

try {
    $log.debug("STARTING APP...");
    PlatformExpress.bootstrap(Server,{})
    .then( (platform) => {
        $log.debug("APP INITIALIZED");
        platform.listen();
    });

} catch (err) {
    $log.error(err);
}