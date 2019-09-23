# Serverless Workshop

Proyecto de ejemplo que demuestra el uso de funciones Lambda con DynamoDB en AWS. Basado en el tutorial [Serverless Stack](http://serverless-stack.com).

## Requisitos

  - Cuenta en AWS con acccess keys configuradas en AWS CLI.
  - Servicio API configurado en API Gateway con autenticación mediante API key.
  - Bucket público en S3.

  Para configurar el Bucket de S3 como público, debe configurarse la siguiente Bucket Policy:

  ```
  {
    "Version":"2012-10-17",
    "Statement":[
      {
        "Sid":"PublicReadForGetBucketObjects",
        "Effect":"Allow",
        "Principal": "*",
        "Action":["s3:GetObject"],
        "Resource":["arn:aws:s3:::YOUR_BUCKET_NAME/*"]
      }
    ]
  }
  ```

  Donde YOUR_BUCKET_NAME debe reemplazarse por el nombre del bucket.

## Instalar paquetes

  Para instalar las dependencias del proyecto:

  `npm install`


## Configurar AWS Amplify

  Para poder utilizar los recursos de AWS en nuestra aplicación React, usaremos una librería llamada AWS Amplify.

  La misma nos provee de algunos módulos simples que facilitarán la conexión a nuestro backend.

  **Instalar AWS Amplify**

  `npm install aws-amplify --save`

  **Crear un archivo de configuración**

  Necesitamos los datos que obtuvimos al hacer deploy de nuestra API para poder configurar nuestro cliente.

  Para ello, crearemos un archivo de configuración en `src/config.js` y agregaremos lo siguiente:

  ```
  export default {
    apiGateway: {
      REGION: "YOUR_API_GATEWAY_REGION",
      URL: "YOUR_API_GATEWAY_URL",
      API_KEY: "YOUR_API_GATEWAY_API_KEY"
    }
  };
  ```
  
  Donde hay que reemplazar:

  - YOUR_API_GATEWAY_REGION por la región de nuestro API Gateway creado en el deploy (en nuestro caso será `us-west-1`).

  - YOUR_API_GATEWAY_URL por la URL de nuestro API Gateway creado en el deploy. En nuestro ejemplo sería: `https://l9xebbjnt8.execute-api.us-west-1.amazonaws.com/dev`

  - YOUR_API_GATEWAY_API_KEY por la API KEY generada para nuestro API Gateway en el deploy.

  **Agregar AWS Amplify**

  Ahora configuremos AWS Amplify.

  Primero importemos la libreria al comienzo de nuestro `src/.index.js`

  `import Amplify from "aws-amplify";`

  Importemos también nuestro archivo de configuración

  `import config from "./config";`

  Para inicializar AWS Amplify, agreguemos lo siguiente sobre la línea `ReactDOM.render` en `src/index.js`

  ```
  Amplify.configure({
    API: {
      endpoints: [
        {
          name: "notes",
          endpoint: config.apiGateway.URL,
          region: config.apiGateway.REGION
        },
      ]
  });
  ```

  Amplify se refiere al servicio API Gateway como `API`.

  El `name: "notes"` simplemente le dice a Amplify que queremos nombrar a nuestra API. Amplify permite agregar multiples APIs en una app. En nuestro caso es una sola.

  Luego, reemplacemos nuestro viejo servicio API con llamadas a API Gateway a través de Amplify:

  - En los archivos `src/containers/Home.js`, `src/containers/NewNote.js` y `src/containers/Notes.js`:

    Reemplacemos `import { API } from 'some-api-service';` 
    
    por `import { API } from 'aws-amplify';`

  - En el archivo `src/libs/utils.js`:

    Importemos nuestro archivo de configuración

    `import config from "../config";`

    Reemplacemos `headers: { 'x-api-key': 'some-api-key' }` 
    
    por `headers: { 'x-api-key': config.apiGateway.API_KEY }`


## Deploy del Frontend en S3
  
  Nuestra aplicación cliente se encuentra lista para el deploy en S3.

  **Crear un build**

  Para crear un build que empaquete y prepare nuestros assets para ser servidos, simplemente corremos:

  `npm run build`

  Esto crea la carpeta `build/` que subiremos.

  **Subir a S3**
  
  Para cargar nuestra app en la nube de AWS, corremos:

  `aws s3 sync build/ s3://YOUR_S3_DEPLOY_BUCKET_NAME`

  Donde YOUR_S3_DEPLOY_BUCKET_NAME es el nombre de nuestro bucket en S3.

  En caso de que nuestro bucket S3 no esté vacío, o que querramos actualizar el contenido de nuestra aplicación, podemos hacer un re-deploy corriendo:

  `aws s3 sync build/ s3://YOUR_S3_DEPLOY_BUCKET_NAME --delete`

  Aquí, el parámetro --delete le dice a S3 que borre todo lo que no estemos incluyendo en esta versión y ya este subido al bucket.

  **Acceder al cliente**

  Una vez subido, nuestro cliente estará disponible a través de la URL asignada al bucket.
