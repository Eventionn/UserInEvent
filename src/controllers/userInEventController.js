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

      // // (Opcional) Chame o microserviço de utilizadores para validar o `user_id`
      // const userExists = await axios.get(`http://userservice:5001/api/users/${user_id}`);
      // console.log("user", userExists)

      //
      // const userExistss = await axios.get(`http://userservice:5001/api/users/${user_id}`);
      // console.log("usertttt", userExistss)
      // if (!userExistss) {
      //   return res.status(404).json({ message: 'User not found' });
      // }

      // if (!userExistsResponse || !userExistsResponse.data) {
      //   return res.status(404).json({ message: 'User not found' });
      // }
      //console.log("User validation successful:", userExistsResponse.data);

      //if (evento existe)
      // const eventExistsResponse = await axios.get(`http://eventservice:5002/api/events/${event_id}`);
      // if (!eventExistsResponse || !eventExistsResponse.data) {
      //   return res.status(404).json({ message: 'Event not found' });
      // }
      // console.log("Event validation successful:", eventExistsResponse.data);
      // const event = eventExistsResponse.data;
      
      //if (preço evento != 0)
    //   //3. Verificar se o preço do evento é diferente de zero
    //   if (event.price && event.price > 0) {
    //     // Criar pagamento
    //     const paymentResponse = await axios.post(`http://paymentservice:5003/api/payments`, {
    //       user_id,
    //       event_id,
    //       amount: event.price, // Envia o preço do evento
    //     });
  
    //     if (!paymentResponse || !paymentResponse.data) {
    //       return res.status(500).json({ message: 'Payment creation failed' });
    //     }
  
    //     console.log("Payment created successfully:", paymentResponse.data);
    //   }


    // Criar UserInEvent
      const newUserInEvent = await userInEventService.createUserInEvent(req.body);


      // Criar pagamento
      // const paymentResponse = await axios.post(`http://paymentservice:5003/api/payments`, {
      //   totalValue,
      //   ticketID,
      //   paymentType,
      // });
      //const paymentResponse = await axios.post(`http://localhost:5004/api/payments`, {
      const paymentResponse = await axios.post(`http://paymentservice:5004/api/payments`, {  
        totalValue: 100,
        ticketID: newUserInEvent.ticketID,
        paymentType: "Mbway",
      });

      if (!paymentResponse || !paymentResponse.data) {
        return res.status(500).json({ message: 'Payment creation failed' });
      }

      console.log("Payment created successfully:", paymentResponse.data);


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
