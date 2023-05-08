import { Inject, Injectable } from '@nestjs/common';
import { CreateOauthtokenDto } from './dto/create-oauthtoken.dto';
import { OAUTHTOKENS_REPOSITORY } from 'src/core/constants';
import { Oauthtoken } from './entities/oauthtoken.entity';

@Injectable()
export class OauthtokensService {
  constructor(
    @Inject(OAUTHTOKENS_REPOSITORY)
    private readonly oauthRepository: typeof Oauthtoken,
  ) {}
  create(createOauthtokenDto: CreateOauthtokenDto) {
    return 'This action adds a new oauthtoken';
  }

  async findAll(): Promise<Oauthtoken[]> {
    return await this.oauthRepository.findAll<Oauthtoken>({
      where: { deletedAt: null },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} oauthtoken`;
  }

  update(id: number) {
    return `This action updates a #${id} oauthtoken`;
  }

  remove(id: number) {
    return `This action removes a #${id} oauthtoken`;
  }
}
