import { compare, hash } from 'bcrypt';
import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {

  constructor(
    // private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly mailService: MailService
  ) { }

  // 회원가입
  async signup(createUserDto: CreateUserDto) {
    const { email, password, passwordConfirm, nickname } = createUserDto;

    const existedUser = await this.userRepository.findOneBy({
      email: email
    });

    if (existedUser) {
      throw new ConflictException("이미 가입된 이메일입니다.");
    }

    if (password !== passwordConfirm) {
      throw new BadRequestException("비밀번호와 비밀번호 확인이 일치하지 않습니다")
    }

    const existedNickname = await this.userRepository.findOneBy({
      nickname: nickname
    })

    if (existedNickname) {
      throw new ConflictException("이미 존재하는 닉네임입니다.");
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await this.userRepository.save({ email, password: hashedPassword, nickname: nickname });

    // 반환값에서 password 제외
    //const { password: _, ...result } = newUser;
    // return result

    return newUser;

  }

  // 이메일 인증
  async verifyemail(email: string) {
    const RandomNumber = (min: number, max: number) => {
      min = Math.ceil(min);
      max = Math.floor(max);

      return Math.floor(Math.random() * (max - min)) + min;
    }

    const verifyNumber = RandomNumber(111111, 999999);

    await this.mailService.sendEmail(email, verifyNumber);

  }

  // 로그인
  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: {
        id: true,
        email: true,
        password: true
      },
    })

    if (!user) {
      throw new UnauthorizedException('이메일을 확인해주세요.')
    }

    if (!(await compare(password, user.password))) {
      throw new UnauthorizedException('비밀번호를 확인해주세요.')
    }

    // jwt에 담을 user의 정보
    // email : 사용자의 데이터
    const payload = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtService.sign(payload, { expiresIn: '1h' }),
    };
  }

  async findByEmail(email: string) {
    return await this.userRepository.findOneBy({ email });

  }

  async findOne(userId: number) {
    return await this.userRepository.findOneBy({ id: userId });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
