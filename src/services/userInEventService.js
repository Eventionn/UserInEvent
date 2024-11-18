const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async getAllUserInEvents() {
    return prisma.userinevent.findMany(); 
  },

  async createUserInEvent(userineventData) {
    return prisma.userinevent.create({
      data: userineventData,
    });
  },
};