import { compare, hash } from 'bcrypt';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { loginUserDto } from './dto/login-user.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  // 회원가입
  async signup(createUserDto: CreateUserDto) {
    const { email, password, passwordConfirm, nickname } = createUserDto;

    const existedUser = await this.userRepository.findOne({
      where: { email: email },
    });

    if (existedUser) {
      throw new ConflictException("이미 가입된 이메일입니다.");
    }

    if (password !== passwordConfirm) {
      throw new BadRequestException("비밀번호와 비밀번호 확인이 일치하지 않습니다")
    }

    const hashedPassword = await hash(password, 12);

    const newUser = await this.userRepository.save({ email, password: hashedPassword, nickname: nickname });

    // 반환값에서 password 제외
    //const { password: _, ...result } = newUser;
    // return result

    return newUser;

  }

  // 로그인
  async login(loginUserDto: loginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      select: ['id', 'email', 'password'],
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('이메일을 확인해주세요.')
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.')
    }

    const payload = { email, sub: user.id };

    return
  }

  async findByEmail(email: string) {
    return this.userRepository.findOneBy({ email });

  }

  findAll() {
    return `This action returns all user`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
