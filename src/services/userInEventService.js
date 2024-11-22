import { prisma } from '../prismaClient.js';

const userInEventService = {

   /**
   * Get all UserInEvents
   * @returns {Promise<Array>} List of all UserInEvents
   */
  async getAllUserInEvents() {
    return prisma.userInEvent.findMany();
  },

   /**
   * Get a specific UserInEvent by ID
   * @param {string} id - The ID of the UserInEvent to fetch
   * @returns {Promise<Object|null>} The UserInEvent object or null if not found
   */
  async getUserInEventById(id) {
    return prisma.userInEvent.findUnique({
      where: {
        ticketID: id, 
      },
    });
  },

   /**
   * Create a new UserInEvent
   * @param {Object} userInEvent - The data for creating the UserInEvent
   * @returns {Promise<Object>} The created UserInEvent object
   */
  async createUserInEvent(userineventData) {
    return prisma.userInEvent.create({
      data: userineventData,
    });
  },

   /**
   * Update an UserInEvent by ID
   * @param {string} id - The ID of the UserInEvent to update
   * @param {Object} updatedData - The updated UserInEvent data
   * @returns {Promise<Object>} The updated UserInEvent object
   */
  async updateUserInEvent(id, updatedData) {
    return prisma.userInEvent.update({
      where: {
        ticketID: id, 
      },
      data: updatedData,
    });
  },

   /**
   * Delete an UserInEvent by ID
   * @param {string} id - The ID of the UserInEvent to delete
   * @returns {Promise<void>} Resolves when the UserInEvent is deleted
   */
  async deleteUserInEvent(id) {
    return prisma.userInEvent.delete({
      where: {
        ticketID: id, 
      },
    });
  },
};

export default userInEventService;
