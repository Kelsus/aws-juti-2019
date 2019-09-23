# Microservicios con Docker en AWS’s ECS

## Configuracion local.

El proyecto requiere un archivo `.env` ubicado en la raiz con las siguientes variables de entorno:

```
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
DYNAMO_DB_TABLE=
```

## Desarrollo

Para correr el servidor en un entorno local (sin docker):

`npm install`

`npm start`

Para correr el servidor en un entorno local (con docker):

`docker build -t={nombre_de_la_imagen} .`

`docker run -p 9000:80 {nombre_de_la_imagen}`

## AWS CLI Configuration
Para poder subir la imagen a ECR, se requiere un profile configurado en `~/.aws/credentials`:

```
[juti2019]
aws_access_key_id=<your-access-key-id>
aws_secret_access_key=<your-secret-access-key>
```

y `~/.aws/config` tiene que tener una seccion (la palabra profile es necesaria):

```
[profile juti2019]
region = us-east-2
```

## Deployment
Asegurate de tener instaladas las ultimas versiones del CLI de AWS y Docker.

1) Obtene la autenticacion del repositorio (mac/linux usando AWS CLI).

    `$(aws ecr get-login --no-include-email --region us-east-2 --profile juti2019)`

Para Windows, usar AWS Tools para PowerShell:

`Invoke-Expression -Command (Get-ECRLoginCommand -Region us-east-1).Command`

Nota: Si recibis "Unknown options: --no-include-email" usando AWS CLI, asegurate de tener la ultima version del CLI.

3) Construi la imagen de docker (si aun no lo hiciste):

    `docker build -t juti-server .`

4) Agrega el tag a la imagen construida para subirla al repositorio:

    `docker tag juti-server:latest 398398166530.dkr.ecr.us-east-2.amazonaws.com/ecs-server-juti2019:1.0.0`

5) Subi la imagen al repositorio:

    `docker push 398398166530.dkr.ecr.us-east-2.amazonaws.com/ecs-server-juti2019:1.0.0`

## Diagramas
- [ECS](./docs/images/ecs.png)

- [ALB](./docs/images/alb.png)