import { Inject, Injectable } from '@nestjs/common';
import { USER_REPOSITORY } from 'src/core/constants';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    ////console.log(createUserDto);
    return await this.userRepository.create<User>(createUserDto);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.findAll<User>({
      where: { delete_status: false },
    });
  }

  async findOneById(id: number): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: { id, delete_status: false },
    });
  }

  async findOneByUserEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({
      where: { email, delete_status: false },
    });
  }

  async findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.userRepository.update<User>(updateUserDto, {
      where: { id },
    });
  }

  async remove(id: number) {
    const data = {
      delete_status: true,
    };
    return await this.userRepository.update<User>(data, { where: { id } });
    //return await this.userRepository.destroy({where: {id}})
  }
}
