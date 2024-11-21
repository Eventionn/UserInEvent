import { prisma } from '../prismaClient.js';

const userInEventService = {
  async getAllUserInEvents() {
    return prisma.userInEvent.findMany(); 
  },

  async createUserInEvent(userineventData) {
    return prisma.userInEvent.create({
      data: userineventData,
    });
  },
};

export default userInEventService;
