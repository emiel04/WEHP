import { BodyParsingError, StateError, WEHPError } from '../errors/WEHPError';
import { prisma } from '../../prisma';
import { NextFunction, Request, Response } from "express";
import { toUserDTO } from '../dtos/dto';

export type TUserCreate = {
    name: string | undefined
}

class WEHPController {
    createAccount = async (userCreate: TUserCreate) => {
        const {name} = userCreate;
        
        if (!name) {
            throw new StateError('Name is required')
        }

        let user = await prisma.user.findFirst(
            {
                where: { name } 
                
            });

        if(user){
            throw new BodyParsingError('User already exists')
        }
        

        const createdUser = await prisma.user.create({
            data: {
                name: name
            }
        })

        return toUserDTO(createdUser);
    }
}

const wehpController = new WEHPController();

export { wehpController }

