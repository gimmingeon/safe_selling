import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class CreateUserDto {

    @IsEmail()
    @IsNotEmpty({ message: "이메일을 입력해주세요." })
    email: string;

    /* 
    @MinLength(8)
    @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/, {
        message: '비밀번호는 최소 8자리, 문자와 숫자를 포함해야 합니다.',
    })
    password: string; 
  */

    @IsString()
    @IsNotEmpty({ message: "비밀번호를 입력해주세요." })
    password: string;

    @IsString()
    @IsNotEmpty({ message: "비밀번호 확인를 입력해주세요." })
    passwordConfirm: string

    @IsString()
    @IsNotEmpty({ message: "닉네임을 입력해주세요." })
    nickname: string;
}
