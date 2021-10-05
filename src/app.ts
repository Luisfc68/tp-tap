import {$log} from "@tsed/common";
import {PlatformExpress} from "@tsed/platform-express";
import {Server} from "./Server";

try {
    $log.debug("Start server...");
    PlatformExpress.bootstrap(Server, {
        // extra settings
    }).then( (platform) => {
        platform.listen()
        $log.debug("Server initialized");
    });

} catch (er) {
    $log.error(er);
}