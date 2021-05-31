import { Investment } from './investment.dto';
import { Portfolio } from './portfolio.dto';

export class User {
  constructor(
    public id: number,
    public portfolio: Portfolio,
    public Investment: Investment[],
  ) {}
}
