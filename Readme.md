# TP de técnicas avanzadas de programación

Este trabajo práctico consiste en el backend de una aplicación de salas de chat en tiempo real. Se espera que dicha aplicación ofrezca las siguientes características:

**IMPORTANTE:** los puntos del 1 al 3 son obligatorios para cumplir con la consigna del trabajo.

1. El usuario contará con una cuenta con la cual se podrá loguear en la aplicación, al entrar se le desplegará una lista de salas de las cuales podrá elegir una para entrar. 
1. Al entrar en dicha sala el usuario podrá ver los mensajes enviados anteriormente, enviar y recibir mensajes. Los demás usuarios conectados a esa sala podrán recibir los mensajes en tiempo real.
1. El usuario tendrá la opción de borrar todos sus mensajes de la sala al momento de retirarse.
1. Si no tiene cuenta, el usuario podrá registrarse en la aplicación para generar una.
1. El usuario podrá crear una cantidad determinada de salas de chat dependiendo del tipo de membresía de su cuenta.
1. El usuario podrá marcar salas como sus favoritas para que al momento de entrar a la aplicación estas se presenten de primeras.
1. El usuario podrá usar una imagen de perfil y también poner imagen a aquellos grupos que haya creado.

Dependiendo de los tiempos puede ser posible que se agreguen nuevas características siempre y cuando se hayan completado las anteriormente planteadas.

## Índice
* [Tecnologías a utilizar](#tecnologías-a-utilizar)
    * [Typescript](#typescript) 
    * [Ts.ED](#tsed)
    * [Mongoose](#mongoose)
    * [PassportJS](#passportjs)
    * [SocketIO](#socketio)
    * [Testing](#testing) (a definir)
* [Pruebas a realizar](#pruebas-a-realizar)
* [Base de datos](#base-de-datos)
* [Documentos](#documentos)
    * [Diagrama de clases](#diagrama-de-clases)
    * [Modelo de datos](#modelo-de-datos)
* [Capas de la aplicación](#capas-de-la-aplicación)
    * [Lógica de negocio](#lógica-de-negocio)
    * [Capa de datos](#capa-de-datos)
    * [Capa de controladores](#capa-de-controladores)
        * [Endpoints](#endpoints)
        * [Eventos](#eventos)
* [Despliegue](#despliegue)
* [Cliente](#cliente)

## Tecnologías a utilizar
    
* ### Typescript
    La razón para elegir este lenguaje es que la capa adicional que le da a javascript permite tener una mayor seguridad gracias al tipado y seguir una programación orientada a objetos más clásica, facilitando la aplicación de patrones de diseño.
* ### Ts.ED
    Este es un framework de Node.js que puede correr sobre Express o Koa. Permite la creación sencilla de aplicaciones de servidor a través de un funcionamiento con anotaciones parecido al de Spring Framework. La razón para elegir este framework es que ofrece una serie de pluggins para integrar diferentes librerías de manera más sencilla entre los cuales hay un plugin de Socket.IO, la cual es la librería obligatoria en el desarrollo de este TP, Mongoose y PassportJS, además facilita la inyección de dependencias usando sus anotaciones. [Esta](https://tsed.io/) es su página.
* ### Mongoose
    La elección de mongoose no tiene mucho misterio, como la base elegida es MongoDB se eligió este ODM para facilitar la interacción con la base y generar una capa de abstracción adicional.
* ### PassportJS
    Existen 3 razones por las cuales elegimos esta librería en vez de usar otra librería para la autenticación o hacerla a mano. La primera es que Ts.ED tiene un plugin para PassportJS por lo que se integra de manera más sencilla, la segunda es que PassportJS puede funcionar con jwt el cual es el estandar que pretendemos usar para la autenticación en la aplicación y, la tercera y más importante, es que PassportJS es flexible y modular por lo que permite generar cierta abstracción en la aplicación con respecto a la tecnología de autenticación que se use, pues soporta una gran cantidad de estrategias.
* ### SocketIO
    Esta librería se usará para la comunicación en tiempo real de las salas de chat. No fue una elección porque es obligatoria en el TP pero igual está buena porque permite usar web sockets de una forma bastante fácil.
* ### Testing
    Todavía no se ha definido una tecnología para el testing, la elección está entre Jest y Mocha pero seguramente termine siendo Mocha.

## Pruebas a realizar

Se intentará realizar pruebas unitarias de todo el sistema, sin embargo, se van a priorizar las funcionalidades críticas de manera que si no se llega a hacer un test unitario de cada clase del sistema, las clases más importantes si estén probadas, por lo tanto se tendrá la siguiente prioridad en la realización de test:
1. Clases incluidas en la capa de lógica de negocio
1. Clases usadas para la persistencia en la base de datos
1. Clases que hereden de ChatEvent las cuales le van a dar la funcionalidad a los sockets (revisar en el diagrama).
1. Controladores.
1. El resto de clases.

## Base de datos

La base de datos elegida es MongoDB, la razón de elegir esta base de datos es porque lo que más convenía para este proyecto era una base de datos NoSQL por la cantidad de modificaciones que se pueden llegar a realizar en paralelo sobre los mismos datos, cosa que sería más lenta en una base de datos relacional. Elegimos MongoDB en particular porque al ser la más famosa es una opción segura para empezar a trabajar con bases de dato no relacionales si no se tiene mucha experiencia con ellas.

## Documentos

* ### Diagrama de clases
    Este es el diagrama de clases del proyecto. Cabe recalcar que lo que aparece en él es lo principal para el funcionamiento del proyecto. No están incluidas las clases del patrón Factory ni del patrón Proxy, por dos razones, la primera es porque no se tiene claro cuales van a ser exactamente los métodos de cada una y la segunda para no sobrecargar aún más el diagrama, sin embargo, la estimación es la siguiente: una factory (en esta clase en particular aún no se sabe si factory o builder) para los chats y otra para los usuarios, y con respecto al patrón proxy se tenía pensado usar un proxy de la clase chat para controlar que los cambios solo sean realizados por el dueño de dicho chat y otro para las clases que se encarguen de la persistencia de manera que se pueda crear una caché de chats. Sin embargo aclaramos que vamos a esperar hasta la implementación para ver si es rentable o no aplicar el proxy.
    [Link](https://drive.google.com/file/d/1FvPPtlrFYyur3rCvuAGnxgsweu9P6BCA/view?usp=sharing) al diagrama.

    **Importante:** todas las dependencias que aparecen en el diagrama de clases son inyectadas gracias al framework que se está usando.

* ### Modelo de datos
    El modelo de datos va a consistir en dos colecciones de documentos, una para los chats y otra para los usuarios. No todos los atributos de los objetos van a ser persistidos en la base: 
    * En el caso de Usuario serán persistidos el id, imgUrl, username, password e email. En el caso de los favRooms se guardará un vector de id para referenciar a la colección de chats. En el caso de suscriptionPlan se guardará un objeto embebido con las características del plan correspondiente.
    * En el caso de Chat serán persistidos id, title, imgUrl,description y el vector de tags. En el caso del owner se guardará una referencia al documento del usuario y en el caso de los mensajes estarán embebidos en un vector dentro del mismo documento del chat. 
    
## Capas de la aplicación

* ### Lógica de negocio
    Esta capa contiene las clases que van a ser persistidas y que contienen el mécanismo de funcionamiento de las salas de chat y los usuarios, un usuario puede tener varias salas de chat favoritas (esto va a ser más que todo para enviar esas salas al cliente para que las muestre de primeras) pero solo puede estar en una sala al mismo tiempo escribiendo, por otra parte el usuario es capaz de crear salas de chat, la capacidad de crearlas o no y la cantidad las va a determinar la implementación de SuscriptionPlan que tenga el usuario de esta manera para que el usuario cambie de suscripción solo hay que remplazar dicho objeto.
* ### Capa de datos
    Esta capa consiste en la implementación del patrón Data Access Object, de esta manera se logra abstraer a la aplicación de la interacción con la base, así se facilita el testing (porque podemos mockear el acceso a datos) y genera una gran flexibilidad pues podemos agregar nuevas clases para interactuar con diferentes bases de datos solo con implementar la interfaz.
* ### Capa de controladores
    Esta capa es la encargada de llevar la interacción del cliente, para explicarla es más fácil dividirla en dos partes, los controladores en sí y los eventos. Con los controladores no hay mucho misterio, ofrecen una serie de endpoints para responder a peticiones REST, para temas que no tienen por qué ser en tiempo real. Con respecto a los eventos, en está solución se pensó en los eventos como cada una de las clases encargadas de gestionar un evento de SocketIO específico, el SocketService (que está definido como servicio porque hay que usar una anotación de servicio de Ts.ED integrar el plugin de SocketIO) está compuesto por un conjunto de clases que heredan de ChatEvent, este siempre trabaja con abstracciones, de esta manera es más fácil agregar nuevos eventos porque solo tenemos que crear una clase que herede de la ya mencionada y los eventos ya existentes están contenidos cada uno en su propia clase, cosa que facilita su mantenimiento. Como el cliente puede enviar cualquier cosa como parámetro y cada evento espera un parámetro distinto, en los eventos está aplicado el patrón template method para dividir el funcionamiento en dos pasos, donde cada evento es responsable de definir la lógica de su funcionamiento (paso 2) y de realizar la validación del parámetro específico que espera (paso 1). 
    
    Con respecto a los servicios, como se mencionó anteriormente, el SocketService es el encargado de gestionar la comunicación con los socket, para conectarse al socket el usuario debe tener un token de jwt que se verifica al momento del handshake. El SocketService espera que se le inyecte un set de eventos con los que va a trabajar, esto quiere decir que podría asumir diferentes funcionamientos dependiendo de las combinaciones de eventos de los set que se le inyecte, por ejemplo, se podría hacer que se le inyecte un set en particular en producción y otro en desarrollo. 

    **Nota:** a los controladores se les inyecta el socket service porque así son capaces de notificar a los socket de eventos que no ocurren en tiempo real, como por ejemplo, un cambio de imagen de usuario.

    Por otro lado está el servicio de las imágenes, este trabaja a través de una abstracción para poder usar diferentes formas de guardar imagenes (inicialmente será local y aws, en aws se va a buscar guardar las imágenes en un S3).

    - ## Endpoints  
        
        | Endpoint | Tipo | Función |
        |:--------:|:----:|:-------:|
        | **/user/login** | POST | Autentica usuario para conseguir token|
        | **/user/signup** | POST | Crea usuario en el sistema |
        | /user/plan | PATCH | Cambia el plan del usuario |
        | /user | PUT | Actualiza el usuario en el sistema |
        | /user/image | POST | Guarda foto de perfil del usuario | 
        | /chat | POST | Crea un chat en el sistema |
        | /chat/{id} | PATCH | Actualiza un chat del sistema |
        | /chat/{id} | DELETE | Borra un chat del sistema |
        | /chat/{id}/image | POST | Guarda una foto de perfil del chat |

        **Aclaración:** todos los endpoints están asegurados y necesitan un token para ser accedidos excepto login y signup, estos son públicos.
        
        **Otra aclaración:** en los endpoint de usuario no se pide id porque se puede determinar con el token.
    
    - ## Eventos
        
        | Evento | Función | Parámetros esperados |
        |:------:|:-------:|:----------:|
        | UserConnected | Envía chats favoritos al cliente, en su defecto, los más nuevos | - |
        | MessageSent | Envía el mensaje a todos los usuarios de ese chat | mensaje |
        | JoinRoom | Establece un chat como el chat actual de un usuario y notifica a los miembros de la entrada | idChat |
        | LeaveRoom | Quita el chat activo del usuario y notifica a los miembros de la salida | - |
        | Clean | Limpia mensajes de un usuario de un chat y notifica a los miembros de dicha limpieza | - |
        | ChatRequest | Envía chats al cliente para mostrar | offset, criterio de búsqueda |
        | MessageRequest | Envía mensajes al cliente para mostar | offset |
        | UserChanged | Avisa al cliente del cambio de un usuario | - |
        | ChatChanged | Avisa al cliente del cambio de un chat |- |
        
    **Nota:** con el socket se puede determinar el usuario, no hace falta mandarlo como parámetro 

## Despliegue
    
Este proyecto va a ser deployado usando dos contendedores de Docker, uno para la aplicación usando una imagen propia hecha a partir de la imagen de node y otro para la base de datos usando la imagen de MongoDB, la idea es deployar esos contenedores usando docker-compose en un EC2 de AWS.

## Cliente

El cliente de este proyecto va a ser móvil y seguramente esté hecho con Quasar.