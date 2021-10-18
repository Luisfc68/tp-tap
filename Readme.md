## Variables de entorno

Agregar en el archivo **.env** en la carpeta raiz del proyecto
|Nombre|Descripción|Ejemplo|Valor por defecto|
|:-:|:-:|:-:|:-:|
|DB_ID|Nombre de la base de datos|basemongo|db|
|DB_URL|Url al servidor de la base|mongodb://ip:puerto/|mongodb://172.17.0.1:27017/|
|PORT|Puerto al que la aplicación va a responder|5555|8080|
|JWT_SECRET|Clave usada para firmar los jwt|akin5423o4in|**OBLIGATORIO**|
|DEFAULT_IMG_USER|Imagen por defecto para los perfiles de usuario|https://i.imgur.com/zPFuLVO.jpeg|**OBLIGATORIO**|
|DEFAULT_IMG_CHAT|Imagen por defecto para los iconos de chat|https://i.imgur.com/CC7V30O.jpeg|**OBLIGATORIO**|
|SOCKET_EVENTS|Establece los eventos de socket que estarán activos según el ambiente| prod o dev |**OBLIGATIORIO**|