import { prisma } from '../prismaClient.js';
import userInEventService from '../services/userInEventService.js';
import axios from 'axios';
import QRCode from 'qrcode';

const userInEventController = {

  /**
   * Get all UserInEvents
   * @auth none
   * @route {GET} /tickets
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
   * @route {GET} /tickets/{id}
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
   * @route {GET} /tickets/my
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
   * Get Tickets by Event ID
   * @auth none
   * @route {GET} /tickets/{eventId}
   * @param {String} eventId - The ID of the UserInEvent
   * @returns {UserInEvent} The UserInEvent object
   */
    async getTicketsByEvent(req, res) {
      const { eventId } = req.params; // gets id from param url
      try {
        const tickets = await userInEventService.getTicketsByEvent(eventId);
    
        if (!tickets) {
          return res.status(404).json({ message: 'Tickets not found' });
        }
    
        res.status(200).json(tickets);
  
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching Event Tickets' });
      }
    },  

  /**
   * Create a new UserInEvent
   * @auth none
   * @route {POST} /tickets
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

      //  const userExistss = await axios.get(`http://userservice:5001/api/users/${user_id}`);
      //  //const userExistss = await axios.get(`http://localhost:5002/api/users/${user_id}`);
      //  console.log("usertttt", userExistss)
      //  if (!userExistss) {
      //     return res.status(404).json({ message: 'User not found' });
      //  }

      //if (evento existe)
      const eventExistsResponse = await axios.get(`http://eventservice:5002/api/events/${event_id}`);
      //const eventExistsResponse = await axios.get(`http://localhost:5002/api/events/${event_id}`);
      if (!eventExistsResponse || !eventExistsResponse.data) {
        return res.status(404).json({ message: 'Event not found' });
      }
      console.log("Event validation successful:", eventExistsResponse.data);
      const event = eventExistsResponse.data;

      // criar ticket 
      const ticketPayload = {
        user_id: userId,
        participated: false,
        event_id: event.eventID,
      };
      const newTicket = await userInEventService.createUserInEvent(ticketPayload);
      console.log("Ticket created successfully:", newTicket);

      // evento nao for gratis
      if (event.price && event.price > 0) {

        try {
          const paymentPayload = {
            totalValue: event.price,
            ticketID: newTicket.id, 
            paymentType: undefined,
          };
          const paymentResponse = await axios.post(`http://paymentservice:5004/api/payments`, paymentPayload);
          //const paymentResponse = await axios.post(`http://localhost:5004/api/payments`, paymentPayload);

          if (!paymentResponse || !paymentResponse.data) {
            // apaga ticket caso pagamento falhe
            await userInEventService.deleteUserInEvent(newTicket.id);
            return res.status(503).json({
              message: 'Payment creation failed, payment service is currently unavailable. Please try again later.',
            });
          }

          console.log("Payment created successfully:", paymentResponse.data);
        } catch (paymentError) {
          console.error("Error during payment creation:", paymentError);
          // apaga ticket caso pagamento falhe
          await userInEventService.deleteUserInEvent(newTicket.id);
          return res.status(503).json({
            message: 'Payment service is currently unavailable. Please try again later.',
          });
        }
      }

      // return ticket
      res.status(201).json(newTicket);
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating UserInEvent' });
    }
  },

  /**
   * Update an existing UserInEvent
   * @auth none
   * @route {PUT} /tickets/{id}
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
   * @route {DELETE} /tickets/{id}
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

  /**
   * Generates a QrCode for ticket by its ID
   * @auth none
   * @route {GET} /tickets/qrcode/{ticketId}
   * @param {String} ticketId - The ID of the ticket
   * @returns {Image} The QR Code image
   */
  async generateQrCode(req, res) {
    const { ticketId } = req.params; // ticketid

    if(ticketId == null){
      return res.status(400).json({ message: 'Invalid ticketId!' });
    }

    const data = `ticket:${ticketId}`; // dados para codificar

    try {
        // gerar qrcode como string Base64
        const qrCodeImage = await QRCode.toDataURL(data);

        // remover o prefixo "data:image/png;base64," 
        const base64Image = qrCodeImage.split(',')[1];

        // converter Base64 para buffer para enviar como imagem PNG
        const buffer = Buffer.from(base64Image, 'base64');

        // cabeçalho de resposta como imagem PNG
        res.setHeader('Content-Type', 'image/png');
        return res.status(200).send(buffer); // enviar imagem diretamente
    } catch (error) {
        console.error('Error generating QR Code:', error);
        return res.status(500).json({ message: 'Error generating QR Code' });
    }
  },

  /**
   * Update an existing UserInEvent
   * @auth none
   * @route {PUT} /tickets/qrcode/read/{ticketId}
   * @param {String} ticketId - The ID of the UserInEvent to update
   * @bodyparam {UserInEvent} userInEvent - The UserInEvent data to update
   * @returns {UserInEvent} The updated UserInEvent object
   */
  async updateUserParticipationInEvent(req, res) {
    const { ticketId } = req.params;

    if(ticketId == null){
      return res.status(400).json({ message: 'Invalid ticketId!' });
    }

  try {

    //updates user participation in the ticket 
    const updatedTicket = await userInEventService.updateUserInEvent(ticketId,{
      participated: true,
    });

    if (!updatedTicket) {
      return res.status(404).json({ message: 'UserInEvent not found' });
    }

      res.status(200).json(updatedTicket);

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating UserInEvent' });
    }
  },

};

export default userInEventController;
