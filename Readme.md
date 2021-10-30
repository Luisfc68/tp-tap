## Variables de entorno

Agregar en el archivo **.env** en la carpeta raiz del proyecto
|Nombre|Descripción|Ejemplo|Valor por defecto|
|:-:|:-:|:-:|:-:|
|DB_ID|Nombre de la base de datos|basemongo|db|
|PORT|Puerto al que la aplicación va a responder|5555|8080|
|JWT_SECRET|Clave usada para firmar los jwt|akin5423o4in|**OBLIGATORIO**|
|DEFAULT_IMG_USER|Imagen por defecto para los perfiles de usuario|image/user/pordefecto.jpeg|**OBLIGATORIO**|
|DEFAULT_IMG_CHAT|Imagen por defecto para los iconos de chat|image/chat/pordefecto.png|**OBLIGATORIO**|
|SOCKET_EVENTS|Establece los eventos de socket que estarán activos según el ambiente| prod o dev |**OBLIGATIORIO**|

Nota: asegurarse que las imagenes por defecto coincidan con la implementación del servicio, por ejemplo, si se está usando el servicio de imágenes local la ruta debe ser image/user/xxx.jpg y si se está usando la implementacion de aws el link debe ser un link de aws (no se ha implementado porque aun no tengo la cuenta)

## Requerimientos para el deploy

 - Tener archivo .env con todas las variables de entorno
 - Tener instalado Docker
 - Tener instalado docker-compose

## Pasos para el deploy

1. Ejecutar -> ` git clone https://github.com/Luisfc68/tp-tap.git `

1. Ejecutar -> ` cd tp-tap `

1. Crear archivo .env y agregar las variables del cuadro de arriba

1. Ejecutar -> ` docker-compose build `

1. Ejecutar -> ` docker-compose up `
