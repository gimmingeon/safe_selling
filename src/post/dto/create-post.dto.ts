import { IsNotEmpty, IsString } from "class-validator";


export class CreatePostDto {

    // title, description

    @IsString()
    @IsNotEmpty({ message: "제목을 입력하세요." })
    title: string;

    @IsString()
    @IsNotEmpty({ message: "내용을 입력하세요." })
    description: string;
}