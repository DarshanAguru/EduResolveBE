import jwt from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import { Users } from '../DataBase/Users.js'
import { checkACL } from '../utils/aclChecker.js'
import dotenv from 'dotenv'
dotenv.config();

const client = jwksClient({
    jwksUri: `https://cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.USER_POOL_ID}/.well-known/jwks.json`
})

function getKey(header, callback) {
    client.getSigningKey(header.kid,(err,key)=>
    {
        const signingKey = key.publicKey || key.rsaPublicKey;
        callback(null,signingKey);
    });
}

export const jwtMiddleWare = async (req,res,next)=>{
    const token  = req.cookies.authToken;
    if(!token){
        return res.status(403).json({message: "No token provided"});
    }

    jwt.verify(token,getKey, { algorithms: ['RS256']}, async (err,decoded) => {
        if(err) {
            logger.error("JWT verification error:", err);
            return res.status(401).json({message: 'invalid token'});
        }

        const userId = decoded.sub;
        const user =  await Users.findOne({cognitoSub: userId});
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }

        req.user = {cognitoSub: user.cognitoSub, userType: user.userType}

        if(!checkACL(req.user.userType, req.originalUrl, req.method))
        {
            return res.status(403).json({message: 'Access Denied'});
        }

        next();
    });
}