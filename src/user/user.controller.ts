import { Controller, Get, Post, Body, Patch, Param, Delete, Res, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { Response, } from 'express';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from './decorator/userInfo.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  // 회원가입
  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return await this.userService.signup(createUserDto);
  }

  @Post('/verifyemail')
  async verifyemail(@Body() body) {
    return await this.userService.verifyemail(body.email);
  }

  // 로그인
  @Post('/login')
  async login(
    @Body() loginUserDto: LoginUserDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.userService.login(loginUserDto);

    res.cookie('Authorization', `Bearer ${token.access_token}`);

    return token;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/me')
  async findMe(@UserInfo('id') userId: number) {

    // 여기서 가져온 user에는 id와 email만 포함되어 있다.

    return await this.userService.findOne(userId);
  }

  // @UseGuards(AuthGuard('jwt'))
  // @Get('/metest')
  // async findMe1(
  //   @UserInfo(['id', 'nickname', 'email']) user: { id: number; nickname: string, email: string },
  // ) {

  //   // 여기서 가져온 user에는 id와 email만 포함되어 있다.
  //   const { id, nickname, email } = user;

  //   console.log(id, nickname, email)

  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
