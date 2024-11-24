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
   * Get UserInEvent tickets
   * @route {GET} /userinevent/my
   * @param {string} id - The ID of the UserInEvent
   * @returns {Array} List of tickets
   */
  async getUserTickets(req, res) {
    try {
      console.log(req.user)
      const userId = req.user.userID;

      console.log(userId)

      const tickets = await userInEventService.getUserTickets(userId);

      if (tickets == null || tickets.length === 0) {
        return res.status(404).json({ message: 'No tickets found' });
      }

      res.status(200).json(tickets);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching tickets' });
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
    const { event_id} = req.body;
    if (!event_id) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {

      //obter id do user logado
      const userId = req.user.userID;

      //
      // const userExistss = await axios.get(`http://userservice:5001/api/users/${user_id}`);
      // console.log("usertttt", userExistss)
      // if (!userExistss) {
      //   return res.status(404).json({ message: 'User not found' });
      // }

      //if (evento existe)
      const eventExistsResponse = await axios.get(`http://eventservice:5002/api/events/${event_id}`);
      //const eventExistsResponse = await axios.get(`http://localhost:5002/api/events/${event_id}`);
       if (!eventExistsResponse || !eventExistsResponse.data) {
         return res.status(404).json({ message: 'Event not found' });
       }
       console.log("Event validation successful:", eventExistsResponse.data);
       const event = eventExistsResponse.data;


      // Criar UserInEvent
      req.body.user_id = userId;  //usar id do user logado
      req.body.participated = false;
      req.body.event_id = event.eventID;
      const newUserInEvent = await userInEventService.createUserInEvent(req.body);


      // Criar pagamento
      if (event.price && event.price > 0) {
          const paymentResponse = await axios.post(`http://paymentservice:5004/api/payments`, { 
          //const paymentResponse = await axios.post(`http://localhost:5004/api/payments`, { 
          totalValue: event.price,
          ticketID: newUserInEvent.ticketID,
          paymentType: "Mbway",
      })
    
      if (!paymentResponse || !paymentResponse.data) {
        return res.status(500).json({ message: 'Payment creation failed' });
      }

      console.log("Payment created successfully:", paymentResponse.data);

    };

      res.status(201).json(newUserInEvent);

    } catch (error) {
      console.error(error);feedback_id
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
   * Update an existing UserInEvent
   * @auth none
   * @route {PUT} /userinevents/{id}/participation
   * @param {String} id - The ID of the UserInEvent to update
   * @bodyparam {UserInEvent} userInEvent - The UserInEvent data to update
   * @returns {UserInEvent} The updated UserInEvent object
   */
  async updateUserParticipationInEvent(req, res) {
    const { id } = req.params;

  try {

    const updatedUserInEvent = await userInEventService.updateUserInEvent(id,{
      participated: true,
    });

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
