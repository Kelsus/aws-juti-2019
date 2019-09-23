# Serverless Workshop

Proyecto de ejemplo que demuestra el uso de funciones Lambda con DynamoDB en AWS. Basado en el tutorial [Serverless Stack](http://serverless-stack.com).

## Requisitos

  - Cuenta en AWS con acccess keys
  - Tabla de notas en DynamoDB

## Configurar la cuenta de AWS CLI

**Instalar AWS CLI**

`sudo pip install awscli`

**Configurar claves de acceso**

  Necesitamos decirle a AWS CLI que use las claves de acceso generadas para nuestro usuario.

  Estas lucen así:
  - Access key ID: AKIAIOSFODNN7EXAMPLE
  - Secret access key: wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY

  Para ello simplemente corra el siguiente comando, agregando las los campos requeridos. La región debe ser `us-west-1`
  
  `aws configure`

## Configurar el Framework Serverless

  **Instalar Serverless**

  `npm install serverless -g`

  **Instalar paquetes Node.js**

  Para instalar las dependencias del proyecto:

  `npm install`

  **Configurar los endpoints**

  El proyecto incluye todo el código necesario para nuestra API. Lo que resta es agregar la configuración necesaria para crear el Stack en AWS en el archivo `serverless.yml`.

  Comenzaremos por describir las propiedades comunes a todas nuestras funciones. Para ello, debemos agregar una sección `provider`:

  ```
  provider:
    name: aws
    runtime: nodejs10.x
    stage: dev
    region: us-west-1
    apiKeys:
      - ${self:custom.clientName}

    # Defines the environment variables for our functions.
    environment:
      tableName: ${self:custom.tableName}
      stripeSecretKey: ${self:custom.environment.stripeSecretKey}

    # 'iamRoleStatements' defines the permission policy for the Lambda function.
    # In this case Lambda functions are granted with permissions to access DynamoDB.
    iamRoleStatements:
        - Effect: Allow
          Action:
            - dynamodb:DescribeTable
            - dynamodb:Query 
            - dynamodb:Scan
            - dynamodb:GetItem
            - dynamodb:PutItem
            - dynamodb:UpdateItem
            - dynamodb:DeleteItem
          # Restrict our IAM role permissions to
          # the specific table for the stage.
          Resource: YOUR_DYNAMODB_TABLE_ARN
  ```

  Donde en la línea final, reemplazamos YOUR_DYNAMODB_TABLE_ARN con el ARN de nuestra tabla de notas en AWS.

  Aquí estamos definiendo entre, otras cosas: 
  - El runtime a utilizar. 
  - La región para nuestras funciones.
  - Que queremos generar un API Gateway API key para nuestro cliente.
  - Las variables de entorno a crear.
  - La policy de IAM que utilizarán las funciones para hacer uso de otros recursos de AWS.

  Además, para cada función de la API debemos:

  - **Describir la función en el archivo serverless.yml**

  Creamos una sección `functions` en nuestra configuración y dentro de ésta describiremos las propiedades de nuestras funciones.

  Por ejemplo, para la función create.js:

  ```
  functions:
    # Defines an HTTP API endpoint that calls the main function in create.js
    # - path: url path is /notes
    # - method: POST request
    # - cors: enabled CORS (Cross-Origin Resource Sharing) for browser cross
    #     domain api call
    # - private: defines this function as private and require an API Gateway API key to invoke it
    create:
      handler: create.main
      events:
        - http:
            path: notes
            method: post
            cors: true
            private: true
  ```

  - **Probar la función localmente**

  Una vez configurada, podemos probar la función invocándola localmente con serverless:

  `serverless invoke local --function create --path mocks/create-event.json`

  La respuesta deberia ser similar a ésta:

  ```
  {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: '{"noteId":"578eb840-f70f-11e6-9d1a-1359b3b22944","content":"hello world","createdAt":1487800950620}'
  }
  ```

## Deploy de las APIs

Una vez que nuestra API esté completa, podemos hacer deploy de la misma:

`serverless deploy`

Al finalizar, podremos encontrar en el output del comando la sección `Service Information`

```
Service Information
service: juti-notes
stage: dev
region: us-west-1
stack: juti-notes-dev
resources: 38
api keys:
  notes-client: OFUCF9oG26oQh5Z2o4uY49Cmdoy5ep883uBkDvI7
endpoints:
  POST - https://l9xebbjnt8.execute-api.us-west-1.amazonaws.com/dev/notes
  GET - https://l9xebbjnt8.execute-api.us-west-1.amazonaws.com/dev/notes/{id}
  GET - https://l9xebbjnt8.execute-api.us-west-1.amazonaws.com/dev/notes
  PUT - https://l9xebbjnt8.execute-api.us-west-1.amazonaws.com/dev/notes/{id}
  DELETE - https://l9xebbjnt8.execute-api.us-west-1.amazonaws.com/dev/notes/{id}
functions:
  create: juti-notes-dev-create
  get: juti-notes-dev-get
  list: juti-notes-dev-list
  update: juti-notes-dev-update
  delete: juti-notes-dev-delete
```

Esta es una lista de nuestros endpoints creados. Toma nota de estos ya que vamos a usarlos mas adelante al configurar nuestro frontend.
También toma nota de la región y la api key generada para este endpoint.

## Deploy de una sola función

Puede darse que necesites hacer deploy de un solo endpoint API en lugar de todos a la vez.
En ese caso, podemos usar el comando `serverless deploy function` para hacerlo, sin tener que pasar por el ciclo entero de deploy. Esto es mucho más rápido a la hora de hacer cambios en nuestras funciones

Por ejemplo, si quisieramos hacer deploy de la funcion `list` de nuevo, podemos correr:

`serverless deploy function -f list`
