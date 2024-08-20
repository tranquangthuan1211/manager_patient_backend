import "dotenv/config";
import jwt from 'jsonwebtoken';

const signToken = ({
    payload,
    secret = process.env.SECRET_KEY as string,
    options = {
        algorithm: 'HS256'
    }

}: {
    payload: any;
    secret?: string;
    options?: jwt.SignOptions;
}) => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, secret, options, (err, token) => {
            if (err) {
                throw reject(err);
            } else {
                resolve(token as string);
            }
        })
    })
}
const verifyToken = ({
    tokens,
    secret = process.env.SECRET_KEY as string,

}: {
    tokens: string;
    secret?: string;
}) => {
    return new Promise<any>((resolve, reject) => {
        const token = tokens.split(" ")[1];
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                throw reject(err);
            } else {
                resolve(decoded);
            }
        })
    })
}

export {signToken, verifyToken}