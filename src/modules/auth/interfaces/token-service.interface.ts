
export interface ITokenService {
    generateAccessToken(payload : any):Promise<string>;
    generateRefreshToken(payload : any):Promise<string>;
}