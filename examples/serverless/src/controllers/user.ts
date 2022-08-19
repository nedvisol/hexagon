import { RestBody, RestController, RestGetMapping, RestHeaderParam, RestPathParam, RestPostMapping, RestQueryParam } from '@nedvisol/hexagon-core';

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

export default UserController;
