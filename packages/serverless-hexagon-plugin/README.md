<p align="center">
    <h1 align="center">Serverless Plugin for Hexagon</h1>
    Hexagon is a tool to help you build portable node micro/nano-services to be deployed as a service or cloud functions.
</p>

# Overview
This package provides an adapter that maps 

See [full documentation](https://github.com/nedvisol/hexagon/blob/main/README.md)

> The motivation behind this library is to help make your Node microservice code more portable, between web frameworks (such as [Express](https://expressjs.com) or [Koa](https://koajs.com/)) or Serverless model with cloud functions. We believe in the [Hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)) where your core business logic should be loosely-coupled with the presentation interface and the underlying services.



# Example
Install Hexagon via NPM
```shell
$ npm install @nedvisol/hexagon-core serverless-hexagon-plugin
```

Write your first controller by creating a plain-old Typescript class and annotate
```js
// index.ts
import { RestController, RestGetMapping, RestPathParam } from '@nedvisol/hexagon-core';
@RestController()
export class UserController {  
 
  @RestGetMapping('/users/:id')
  getUser (@RestPathParam('id') id: string): IUser {
    return { id, name: 'test' };
  }
}

```

Then add Hexagon plugin, and the controller details to your Serverless configuration.
> Note: using Typescript format for Serverless configuration is required. We use this to load the controller files at build time to able to generate the handlers.

serverless.ts:
```js
import type { AWS } from '@serverless/typescript';

import './index'; // this is where your annotated controller class is, load all files as needed

const serverlessConfiguration: AWS = {
    //...
    plugins: ['serverless-hexagon-plugin', ...],  // put Hexagon plugin before other plugins such as module bundlers or offline plugin
    custom: {
        hexaTsPlugin: {
            controllers: [  // declare each of your controller and the file it resides in
                {
                    controllerClass: 'UserController',
                    file: './index.ts'
                }
            ]
        }
    }
}
```
> Note: your controller names must be unique.

Then you can use Serverless life cycle as normal. The plugin is activated in the initialization of Serverless life-cycle. It automatically generates the function configuration, event mapping, and the function handler code, which will be used by all subsequent steps.

```shell
$ serverless deploy -r us-west-2 -s dev
```
