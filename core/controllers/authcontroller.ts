import { BodyParsingError, StateError, TimedOutError, UnauthorizedError, WEHPError } from '../errors/WEHPError';
import { prisma } from '../../prisma';
import { NextFunction, Request, Response } from "express";
import { toUserDTO } from '../dtos/dto';
import { hash, compare } from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
export type TUserCreate = {
    name: string,
    pin: string
}
export type TUserLogin = {
    name: string,
    pin: string
}


const MAX_ATTEMPTS = 3;
const TIMEOUT_MINUTES = 15;

class AuthController {
    createAccount = async (userCreate: TUserCreate) => {
        const { name, pin } = userCreate;
        
        if (!name) throw new StateError('Name is required');
        if (!pin) throw new StateError('Pin is required');
        if (!/^\d{5}$/.test(pin)) throw new StateError('Pin must be exactly 5 digits long');

        let user = await prisma.user.findFirst({
            where: { name },
        });

        if (user) {
            throw new BodyParsingError('User already exists');
        }

        const hashedPin = await hash(pin, 10); // Hash the pin using bcrypt

        const createdUser = await prisma.user.create({
            data: {
                name: name,
                pincode: hashedPin, // Set the hashed pincode during user creation
            },
        });

        return toUserDTO(createdUser);
    }
   
    login = async (loginData: TUserLogin) => {
        const {pin, name} = loginData;
        
        if (!pin) {
            throw new StateError('pin is required')
        }
        if (!name) {
            throw new StateError('name is required')
        }
     
        const user = await prisma.user.findFirst({where: {name}})

        if (!user) {
            throw new UnauthorizedError();
        }

        if (user.timeout && new Date() < new Date(user.timeout)) {
            const now = new Date().getTime();
            const timeoutTime = new Date(user.timeout).getTime();
            const timeLeft = timeoutTime - now;
      
            const minutesLeft = Math.floor((timeLeft / 1000) / 60);
            const secondsLeft = Math.floor((timeLeft / 1000) % 60);
            const totalSeconds = Math.floor(timeLeft / 1000);

            throw new TimedOutError('User is currently timed out', { minutesLeft, secondsLeft, totalSeconds });
          }


        if (!await compare(pin, user.pincode)) {
            const loginAttempts = user.loginAttempts + 1;
            const updateData: any = {
              loginAttempts,
              lastAttempt: new Date(),
            };
      
            if (loginAttempts >= MAX_ATTEMPTS) {
              updateData.timeout = new Date(Date.now() + TIMEOUT_MINUTES * 60000); 
            }
      
            await prisma.user.update({
              where: { id: user.id },
              data: updateData,
            });
      
            throw new UnauthorizedError();
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: 0,
              lastAttempt: null,
              timeout: null,
            },
          });

        const token = jwt.sign({
            sub: user.name,
            isWehp: user.isWehp
        } as CLAIMS, process.env.SECRET)
        
        return token;
    }
}

export type CLAIMS = {
    sub: string,
    isWehp: boolean
}

const authController = new AuthController();

export { authController }

