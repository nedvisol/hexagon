<p align="center">
    <h1 align="center">Hexagon adapter for Express</h1>
    Hexagon is a tool to help you build portable node micro/nano-services to be deployed as a service or cloud functions.
</p>

# Overview
This package provides an adapter that maps 

See [full documentation](https://github.com/nedvisol/hexagon/blob/main/README.md)

> The motivation behind this library is to help make your Node microservice code more portable, between web frameworks (such as [Express](https://expressjs.com) or [Koa](https://koajs.com/)) or Serverless model with cloud functions. We believe in the [Hexagonal architecture](https://en.wikipedia.org/wiki/Hexagonal_architecture_(software)) where your core business logic should be loosely-coupled with the presentation interface and the underlying services.



# Example
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