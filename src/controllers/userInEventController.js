import { prisma } from '../prismaClient.js';

const userInEventController = {

  /**
   * Get all UserInEvents
   * @auth none
   * @route {GET} /userinevents
   * @returns {Array} List of UserInEvents
   */
  async getAllUserInEvents(req, res) {
    try {
      const userinevents = await prisma.userInEvent.findMany();
      res.status(200).json(userinevents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching userInEvents' });
    }
  },

  /**
   * Get a UserInEvent by its ID
   * @auth none
   * @route {GET} /userinevents/{id}
   * @param {String} id - The ID of the UserInEvent
   * @returns {UserInEvent} The UserInEvent object
   */
  async getUserInEventById(req, res) {
    const { id } = req.params; // gets id from param url
    try {
      const userInEvent = await prisma.userInEvent.findUnique({
        where: {
          ticketID: id, 
        },
      });
  
      if (!userInEvent) {
        return res.status(404).json({ message: 'UserInEvent not found' });
      }
  
      res.status(200).json(userInEvent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching UserInEvent by ID' });
    }
  },

  /**
   * Create a new UserInEvent
   * @auth none
   * @route {POST} /userinevents
   * @bodyparam {UserInEvent} userInEvent - The UserInEvent object to create
   * @returns {UserInEvent} The created UserInEvent object
   */
  async createUserInEvent(req, res) {
    const { user_id, event_id, participated } = req.body;

    try {
      // (Opcional) Chame o microserviço de utilizadores para validar o `user_id`
      // const userExists = await axios.get(`http://users-service/api/users/${user_id}`);
      // if (!userExists) {
      //   return res.status(404).json({ message: 'User not found' });
      // }

      // Criar UserInEvent
      const newUserInEvent = await prisma.userInEvent.create({
        data: {
          user_id,
          event_id,
          participated,
        },
      });

      res.status(201).json(newUserInEvent);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating UserInEvent' });
    }
  },

  /**
   * Update an existing UserInEvent
   * @auth none
   * @route {PUT} /userinevents/{id}
   * @param {String} id - The ID of the UserInEvent to update
   * @bodyparam {UserInEvent} userInEvent - The UserInEvent data to update
   * @returns {UserInEvent} The updated UserInEvent object
   */
  async updateUserInEvent(req, res) {
    const { id } = req.params;
    const { user_id, event_id, participated,feedback_id } = req.body;

    try {
      const updatedUserInEvent = await prisma.userInEvent.update({
        where: {
          ticketID: id, // ticketID como chave primária
        },
        data: {
          user_id,
          event_id,
          participated,
          feedback_id,
        },
      });

      res.status(200).json(updatedUserInEvent);
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'UserInEvent not found' });
      }
      res.status(500).json({ message: 'Error updating UserInEvent' });
    }
  },

  /**
   * Delete a UserInEvent by its ID
   * @auth none
   * @route {DELETE} /userinevents/{id}
   * @param {String} id - The ID of the UserInEvent to delete
   * @returns {Object} The result of the deletion
   */
  async deleteUserInEvent(req, res) {
    const { id } = req.params;

    try {
      const deletedUserInEvent = await prisma.userInEvent.delete({
        where: {
          ticketID: id, // ticketID como chave primária
        },
      });

      res.status(200).json({ message: 'UserInEvent deleted successfully', deletedUserInEvent });
    } catch (error) {
      console.error(error);
      if (error.code === 'P2025') {
        return res.status(404).json({ message: 'UserInEvent not found' });
      }
      res.status(500).json({ message: 'Error deleting UserInEvent' });
    }
  },
};

export default userInEventController;
