import { IsNotEmpty, IsString } from "class-validator";

export class CreatePostCommentDto {

    @IsString()
    @IsNotEmpty({ message: "내용을 입력하세요." })
    description: string;
}
