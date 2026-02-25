import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ description: 'Email', example: 'user@example.com' })
    @IsEmail()
    email: string;

    @ApiProperty({ description: 'Пароль', example: 'password123' })
    @IsString()
    @MinLength(2)
    name: string;
}
