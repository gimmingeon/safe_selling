import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsString, Min } from "class-validator";


export class FindAllPosts {

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    @Min(1)
    page?: number = 1;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number = 10;

    @IsOptional()
    @IsString()
    search?: string;
}