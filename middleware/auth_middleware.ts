import { NextFunction } from "express";
import {Request, Response} from "express";
import { AuthPayloadContext, JwtService } from "../service/jwt_service";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

declare module 'express-serve-static-core' {
    interface Request {
        user?: any;
    }
}

export interface AuthenticatedSocket extends Socket {
    user: AuthPayloadContext;
  }

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if(req.method === 'Options') next();

    const bearer = req.headers?.authorization?.substring(7);

    if (bearer == null || bearer == undefined) {
        return res.status(401).json({message: "User has not authenticated"});
    }
    try {
      const payload = await JwtService.verifyToken(bearer);
      req.user = payload;
    } catch(e) {
      return res.status(401).json({message: "Failed jwt verify"});
    }
    
    next();
}

export const socketAuthMiddleware = (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
    try {
      const authHeader = socket.handshake.auth?.token || socket.handshake.headers?.authorization;
      if (!authHeader) {
        return next(new Error("Authentication error"));
      }

      const token = authHeader;
      if (!token) {
        return next(new Error("Authentication error"));
      }
  
      JwtService.verifyToken(token)
        .then((value) => {
          (socket as AuthenticatedSocket).user = value;
          next();
        })
        .catch((e) => {
          next(new Error("Authentication error"));
        });
    } catch (e) {
      next(new Error("Authentication error"));
    }
  };