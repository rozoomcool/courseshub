import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

dotenv.config();

const secretKey: string = process.env.SECRET_KEY as string;
const refreshSecretKey: string = process.env.REFRESH_SECRET_KEY as string;
const tokenExpiration: number = parseInt(process.env.TOKEN_EXPIRATION as string);
const refreshTokenExpiration: number = parseInt(process.env.REFRESH_TOKEN_EXPIRATION as string);

export interface AuthPayloadContext {
    id: number
    username: string,
    role: string
}

export class JwtService {

    
    static async generateAccessToke (payload: AuthPayloadContext) : Promise<string> {
        return jwt.sign(payload, secretKey, {expiresIn: tokenExpiration});
    }
    
    static async generateRefreshToken (id: number): Promise<string> {
        const payload = {id}
        return jwt.sign(payload, refreshSecretKey, {expiresIn: refreshTokenExpiration})
    }
    
    static async verifyToken (token: string): Promise<AuthPayloadContext> {
        try {
            return jwt.verify(token, secretKey) as AuthPayloadContext;
        } catch(e) {
            console.log(`Failed verify token ${e}`)
            throw Error(`Failed verify token ${e}`)
        }
    }
    
    static async verifyRefreshToken (token: string): Promise<{id: number}> {
        try {
            return jwt.verify(token, refreshSecretKey) as {id: number};
        } catch(e) {
            console.log(`Failed verify token ${e}`)
            throw Error(`Failed verify token ${e}`)
        }
    }
}