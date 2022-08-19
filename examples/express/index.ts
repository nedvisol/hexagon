import express from 'express';
import bodyParser from 'body-parser';
import { RestBody, RestController, RestGetMapping, RestHeaderParam, RestPathParam, RestPostMapping, RestQueryParam } from '@nedvisol/hexagon-core';
import { initializeExpressApp } from '@nedvisol/hexagon-adapter-express';

interface IUser {
  id: string
  name: string
}

@RestController()
export class UserController {
  @RestGetMapping('/users')
  getUsers (@RestQueryParam('search') searchQuery: string): IUser[] {
    if (searchQuery) {
      return [{ id: '1', name: searchQuery }];
    } else {
      return [{ id: '2', name: 'all' }];
    }
  }

  @RestGetMapping('/users/:id')
  getUser (@RestPathParam('id') id: string): IUser {
    return { id, name: 'test' };
  }

  @RestPostMapping('/users')
  creatUpdateUser (@RestBody({ encoding: 'json' }) user: IUser): IUser {
    return { id: 'new-id', name: user.name };
  }

  @RestGetMapping('/info')
  getInfo (@RestHeaderParam('content-type') contentType: string): string {
    return contentType;
  }
}

const app = express();
app.use(bodyParser.text());
initializeExpressApp(app);

app.listen(3000, () => {
  console.log('listening on port 3000!');
});
