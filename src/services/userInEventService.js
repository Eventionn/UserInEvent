import { prisma } from '../prismaClient.js';

const userInEventService = {
  async getAllUserInEvents() {
    return prisma.userInEvent.findMany();
  },

  async getUserInEventById(id) {
    return prisma.userInEvent.findUnique({
      where: {
        ticketID: id, 
      },
    });
  },

  async createUserInEvent(userineventData) {
    return prisma.userInEvent.create({
      data: userineventData,
    });
  },

  async updateUserInEvent(id, updatedData) {
    return prisma.userInEvent.update({
      where: {
        ticketID: id, 
      },
      data: updatedData,
    });
  },

  async deleteUserInEvent(id) {
    return prisma.userInEvent.delete({
      where: {
        ticketID: id, 
      },
    });
  },
};

export default userInEventService;
