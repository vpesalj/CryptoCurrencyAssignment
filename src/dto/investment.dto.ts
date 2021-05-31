import { Portfolio } from './portfolio.dto';

export class Investment {
  constructor(
    public id: number,
    public name: string,
    public shortName: string,
    public unitPrice: number,
    public amount: number,
    public value: number,
    public portfolio: Portfolio,
  ) {}
}
