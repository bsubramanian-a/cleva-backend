import { Test, TestingModule } from '@nestjs/testing';
import { OauthtokensService } from './oauthtokens.service';

describe('OauthtokensService', () => {
  let service: OauthtokensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OauthtokensService],
    }).compile();

    service = module.get<OauthtokensService>(OauthtokensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
