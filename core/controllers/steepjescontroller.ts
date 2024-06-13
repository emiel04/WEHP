import { prisma } from '../../prisma'; // Import Prisma instance and models
import { BodyParsingError, StateError } from '../errors/WEHPError';
import { StreepjeDTO, toStreepjeDTO } from '../dtos/dto'; // Define StreepjeDTO as needed

export type TStreepjeCreate = {
  reason: string;
  userId: number;
}

export type TStreepjeUpdate = {
  reason: string;
}

class StreepjeController {
  createStreepje = async (streepjeCreate: TStreepjeCreate): Promise<StreepjeDTO> => {
      const { reason, userId } = streepjeCreate;

      if (!userId) {
        throw new BodyParsingError('no userId provided');
      }  
  

      // Check if user exists
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
          throw new StateError('User not found');
      }

      // Create Streepje record
      const createdStreepje = await prisma.streepje.create({
          data: {
              reason,
              userId,
          },
      });

      return {
          id: createdStreepje.id,
          reason: createdStreepje.reason,
          userId: createdStreepje.userId,
      };
  }

  getStreepjesByUserId = async (userId: number): Promise<StreepjeDTO[]> => {


    if (!userId) {
      throw new BodyParsingError('no userId provided');
    }


      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
          throw new StateError('User not found');
      }

      const streepjes = await prisma.streepje.findMany({
          where: { userId },
          include: { user: true }, 
      });

      return streepjes.map((streepje) => ({
          id: streepje.id,
          reason: streepje.reason,
          userId: streepje.userId,
      }));
  }

  updateStreepje = async (streepjeId: number, streepjeUpdate: TStreepjeUpdate): Promise<StreepjeDTO> => {
    const { reason } = streepjeUpdate;

    const existingStreepje = await prisma.streepje.findUnique({ where: { id: streepjeId } });
    if (!existingStreepje) {
      throw new StateError('Streepje not found');
    }

    // Update Streepje
    
    const updatedStreepje = await prisma.streepje.update({
      where: { id: streepjeId },
      data: { reason: reason ?? null   },
    });

    return toStreepjeDTO(updatedStreepje);
  }

  deleteStreepje = async (streepjeId: number) => {
    if (!streepjeId) {
      throw new BodyParsingError('no streepjeId provided');
    }

    const existingStreepje = await prisma.streepje.findUnique({ where: { id: streepjeId } });
    if (!existingStreepje) {
      throw new StateError('Streepje not found');
    }

    // Delete Streepje
    await prisma.streepje.delete({ where: { id: streepjeId } });
    return toStreepjeDTO(existingStreepje);
  }
}

const streepjeController = new StreepjeController();

export { streepjeController };