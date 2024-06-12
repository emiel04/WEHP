import { CLAIMS } from './../controllers/authcontroller';
import { prisma } from './../../prisma';
import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/WEHPError";
import * as jwt from 'jsonwebtoken'

const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;
  if (!token) {
    next(new UnauthorizedError())
  }
  try {    
    const payload: CLAIMS = jwt.verify(token.split("Bearer ")[1], process.env.SECRET) as any
    const user= await prisma.user.findFirst({where: {name: payload.sub}})
    if(!user) next(new UnauthorizedError())
    req.user = user;
    next()
  } catch (error) {
    next(new UnauthorizedError())
  }
}

export {authMiddleware}