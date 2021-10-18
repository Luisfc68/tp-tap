import { InjectorService, registerProvider } from "@tsed/di";
import { EventConstructor } from "../socket.interfaces";
import devSet from "./sets/devSet";
import prodSet from "./sets/prodSet";

export const ActiveEvents = Symbol.for("ActiveEvents"); //IDENTIFICADOR PARA EL PROVIDER

const injector = new InjectorService();
let events:EventConstructor[];

if(process.env.SOCKET_EVENTS === "dev")
    events = devSet;
else if(process.env.SOCKET_EVENTS === "prod")
    events = prodSet;



injector.load()
.then(() => {
    //Simplemente agrupa los eventos que ya estan en el contenedor dentro de un vector
    registerProvider({
        provide: ActiveEvents,
        useFactory: () => events.map(e => injector.get(e))
    });
});