import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<UserEntity>);
    create(userDto: Partial<UserEntity>): Promise<UserEntity>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findById(id: number): Promise<UserEntity | null>;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateUserDto: UpdateUserDto): string;
    remove(id: number): string;
}
