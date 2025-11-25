import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async create(userDto: Partial<UserEntity>): Promise<UserEntity> {
    const { email, fullName, password, phone } = userDto;
    const user = await this.userRepository.create({
      email,
      fullName,
      password,
      phone,
    });

    await this.userRepository.save(user);
    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
  async findById(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ id });
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findOne(id: number): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ id });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
