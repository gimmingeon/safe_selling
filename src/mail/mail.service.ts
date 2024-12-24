import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import Mail from "nodemailer/lib/mailer";
import * as nodemailer from 'nodemailer'


@Injectable()
export class MailService {

    private transporter: Mail;

    constructor(
        private readonly configService: ConfigService,
    ) {
        this.transporter = nodemailer.createTransport({
            // smtp 설정
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: this.configService.get<string>('NODEMAILER_USER'),
                pass: this.configService.get<string>('NODEMAILER_PASS')
            }
        });
    }

    async sendEmail(email: string, verifyNumber: number) {
        return await this.transporter.sendMail({
            from: this.configService.get<string>('NODEMAILER_USER'),
            to: email,
            subject: '이메일 인증번호',
            text: `인증번호 : ${verifyNumber}`,
        });
    }
}