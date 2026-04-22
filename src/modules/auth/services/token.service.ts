import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ITokenService } from '../interfaces/token-service.interface';

@Injectable()
export class TokenService implements ITokenService {

    constructor(private readonly jwtService: JwtService) {}

    async generateRefreshToken(payload: any): Promise<string> {
        return this.jwtService.signAsync(payload , {
            secret : process.env.JWT_REFRESH_SECRET,
            expiresIn : '7d'
        });
    }
    async generateAccessToken(payload: any): Promise<string> {
        return this.jwtService.signAsync(payload, {
            secret : process.env.JWT_SECRET,    
            expiresIn : '5m'
        });
    }
}
