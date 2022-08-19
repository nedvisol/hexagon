<p align="center">
    <h1 align="center">Hexagon</h1>
    Hexagon is a tool to help you build portable node micro/nano-services to be deployed as a service or cloud functions.
</p>

# Get Started
<a name="get-started"></a>
Install Hexagon via NPM
```shell
$ npm install @nedvisol/hexagon-core @nedvisol/hexagon-adapter-express
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

Then apply to your favorite web/API server
```js
// index.ts (cont..)
import { initializeExpressApp } from '@nedvisol/hexagon-adapter-express';

const app = express();
app.use(bodyParser.text());
initializeExpressApp(app);

app.listen(3000, () => {
  console.log('listening on port 3000!');
});
```

Start the server
```shell
$ ts-node index.ts
```

In a different terminal
```shell
$ curl -v http://localhost:3000/users/id-001
```
You should see a response:
```
{"id": "id-001", "name": "test"}
```

See [more examples here](./packages/hexagon-examples/)


# Table of Contents
* [Get Started](#get-started)
* [Overview](#overview)
* [Decorators](#decorators)
* [Use with Express](#express-usage)
* [Use with Serverless](#serverless-usage)


# Overview
<a name="overview"></a>
The motivation behind this library is to help make your Node microservice code more portable, between web frameworks (such as [Express](https://expressjs.com) or [Koa](https://koajs.com/)) or Serverless model with cloud functions. We believe in the [Hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)) where your core business logic should be loosely-coupled with the presentation interface and the underlying services.

The focus of this library (at least for now) will be for de-coupling the presentation. You may want to consider de-coupling downstream services such as databases by other means. For relational datastore, you may want to consider [Sequelize](https://sequelize.org/) or [Knex](https://knexjs.org/) where NoSQL Document store, MongoDB API could be an option (works for Azure CosmoDB and AWS DocumentDB).

# Decorators
<a name="decorators"></a>
Typescript decorators are used to "annotate" the Typescript class that contains your controller logic (HTTP Restful or events, etc). When using Hexagon, you will need to set `experimentalDecorators` in your `tsconfig.json` file to `true` to allow the feature.
```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
````

## @RestController
This decorator is used at a class level to register the class as a controller. At run-time, the integration script will scan, pick up, and integrate the controller with your presentation tier.

No parameter/options required.

Usage:
```js
@RestController()
export class UserController {
   //...
}
```

## @RestXXXMapping
A set of decorators that map a class method to a RESTful method and a path. Currently GET, POST, PUT, DELETE, and OPTIONS are supposed using `@RestGetMapping`, `@RestPostMapping`, `@RestPutMapping`, `@RestDeleteMapping`, and `@RestOptionsMapping` respectively.

The path mapping decorator takes one parameter which contains the path value.

Usage:
```js
{

    @RestGetMapping('/users')
    getUsers(): IUsers[] {
        return [...]
    }
}
```

## @RestXXXParam
A set of decorators that map a method parameter to RESTful/HTTP parameter values. Currently Querystring, Path, and Header values are supported using `@RestQueryParam`, `@RestPathParam`, and `@RestHeaderParam`, respectively.

The parameter mapping decorator takes one parameter which contains the name of the parameter name.

Usage (query string):
```js
{
    @RestGetMapping('/users')
    getUsers(@ResetQueryParam('query') query: string): IUser[] {        
        return [...]
    }   
}
```
In the above example, `query` method parameter maps to the query string parameter named "query" in `/users?query=xxxxx`.

Usage (path):
```js
{
    @RestGetMapping('/users/:id')
    getUser(@ResetQueryParam('id') id: string): IUser {        
        return {...}
    }   
}
```
> :warning:  Note on path format:
>
> In the above example, `id` method parameter maps to the path parameter named "id" in `/users/xxxxx`. Note that format used for defining path parameters (or variables) may differ by frameworks. For example, ExpressJS uses `/:name` format, where AWS API Gateway event uses `/{name}` format. The library does not perform any conversion at this time.

## @RestBody
This decorator maps the request body to a method parameter. It takes one optional parameter to specify options for the body conversion.

```js
{
    encoding: 'raw' // raw or json
}
```
When specifying JSON, it library will automatically parse the text as JSON and pass to the method as an object.

> :warning: ** Note for Express:
> 
> You will need a body parser to parse the request body as text for this decorator to work.
> ```js
> import bodyParser from 'body-parser';
>
> const app = express();
> app.use(bodyParser.text()); // need this
> ```

# Use with Express
To use with Express, you will need a helper module `@nedvisol/hexagon-adapter-express` to populate Express routes with the controller methods.

The Typescript files containing your controllers need to be imported at least once before the you use the helper module so that the decorators are executed.

```js

import './controllers/user';   // this is where your annotated controller class is

import { initializeExpressApp } from '@nedvisol/hexagon-adapter-express';

const app = express();
app.use(bodyParser.text());
initializeExpressApp(app);

app.listen(3000, () => {
  console.log('listening on port 3000!');
});
```

That's it.

Your Express app now has the routes populated with methods defined in your controller files.


# Use with Serverless
At this time, we feel the best way to maximize the portability, [Serverless framework](https://serverless.com/framework/docs) is the way to go.

## AWS Integration
You can map your controllers to AWS API Gateway and Lambda functions using server. (More event types coming soon!). A Serverless plugin `serverless-hexagon-plugin` will be used to load and map your controllers. Currently Hexagon is compatible with Serverless version 3.22+.

First step is to install the login via NPM (or Yarn) 
```shell
$ npm install -D serverless-hexagon-plugin
```

Then add Hexagon plugin, and the controller details to your Serverless configuration.
> Note: using Typescript format for Serverless configuration is required. We use this to load the controller files at build time to able to generate the handlers.

serverless.ts:
```js
import type { AWS } from '@serverless/typescript';

import './src/controllers/user'; // this is where your annotated controller class is, load all files as needed

const serverlessConfiguration: AWS = {
    //...
    plugins: ['serverless-hexagon-plugin', ...],  // put Hexagon plugin before other plugins such as module bundlers or offline plugin
    custom: {
        hexaTsPlugin: {
            controllers: [  // declare each of your controller and the file it resides in
                {
                    controllerClass: 'UserController',
                    file: './src/controllers/user.ts'
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
