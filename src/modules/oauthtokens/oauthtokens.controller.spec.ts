import { Test, TestingModule } from '@nestjs/testing';
import { OauthtokensController } from './oauthtokens.controller';
import { OauthtokensService } from './oauthtokens.service';

describe('OauthtokensController', () => {
  let controller: OauthtokensController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OauthtokensController],
      providers: [OauthtokensService],
    }).compile();

    controller = module.get<OauthtokensController>(OauthtokensController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
