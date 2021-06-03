import { Test, TestingModule } from '@nestjs/testing';
import { InvestmentGroupService } from './investment-group.service';

describe('InvestmentGroupService', () => {
  let service: InvestmentGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestmentGroupService],
    }).compile();

    service = module.get<InvestmentGroupService>(InvestmentGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
