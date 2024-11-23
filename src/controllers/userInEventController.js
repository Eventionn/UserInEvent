import { prisma } from '../prismaClient.js';
import userInEventService from '../services/userInEventService.js';
import axios from 'axios';

const userInEventController = {

  /**
   * Get all UserInEvents
   * @auth none
   * @route {GET} /userinevents
   * @returns {Array} List of UserInEvents
   */
  async getAllUserInEvents(req, res) {
    try {
      const userinevents = await userInEventService.getAllUserInEvents();

      if (userinevents == null || userinevents.length === 0) {
        return res.status(404).json({ message: 'No userinevents found' });
      }

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
      const userInEvent = await userInEventService.getUserInEventById(id);
  
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
    if (!user_id || !event_id || !participated) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {


      // (Opcional) Chame o microserviço de utilizadores para validar o `user_id`
      const userExists = await axios.get(`http://userservice:5001/api/users/${user_id}`);
      console.log("user", userExists)

      const userExistss = await axios.get(`http://localhost:5001/api/users/${user_id}`);
      console.log("usertttt", userExists)
      if (!userExistss) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Criar UserInEvent
      const newUserInEvent = await userInEventService.createUserInEvent(req.body);

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

  try {
    const userInEventData = req.body;

    const updatedUserInEvent = await userInEventService.updateUserInEvent(id, userInEventData);
    if (!updatedUserInEvent) {
      return res.status(404).json({ message: 'UserInEvent not found' });
    }

      res.status(200).json(updatedUserInEvent);

    } catch (error) {
      console.error(error);
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
      const deletedUserInEvent = await prisma.userInEvent.delete(id);

      if (!deletedUserInEvent) {
        return res.status(404).json({ message: 'UserInEvent not found' });
      }

      res.status(200).json({ message: 'UserInEvent deleted successfully', deletedUserInEvent });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting UserInEvent' });
    }
  },
};

export default userInEventController;
