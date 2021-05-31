import { User } from './user.dto';

export class Portfolio {
  constructor(public id: number, public user: User) {}
}
