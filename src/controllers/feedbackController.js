import { prisma } from '../prismaClient.js';

const feedbackController = {

  /**
   * Get all Feedbacks
   * @auth none
   * @route {GET} /feedbacks
   * @returns {Array} List of Feedbacks
   */
  async getAllFeedbacks(req, res) {
    try {
      const feedbacks = await prisma.feedback.findMany();
      res.status(200).json(feedbacks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching feedbacks' });
    }
  },

  /**
   * Get a Feedback by its ID
   * @auth none
   * @route {GET} /feedbacks/{id}
   * @param {String} id - The ID of the Feedback
   * @returns {Feedback} The Feedback object
   */
  async getFeedbackById(req, res) {
    const { id } = req.params; // gets id from param url
    try {
      const feedback = await prisma.feedback.findUnique({
        where: {
          feedbackID: id, 
        },
      });
  
      if (!feedback) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
  
      res.status(200).json(feedback);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching Feedback by ID' });
    }
  },

  /**
   * Get Feedbacks for a specific Event
   * @auth none
   * @route {GET} /feedbacks/event/{eventId}
   * @param {String} eventId - The ID of the Event
   * @returns {Array} List of Feedbacks for the Event
   */
    async getEventFeedbacks(req, res) {
        const { eventId } = req.params; // get event id from param url
        try {
            // get todos UserInEvents relacionados ao event id
            const userInEvents = await prisma.userInEvent.findMany({
            where: {
                event_id: eventId,
                feedback_id: { not: null }, // apenas feedbacks não null
            },
            include: {
                feedback: true, // feedback data
            },
            });

            console.log(userInEvents);
            // get apenas feedbacks
            const feedbacks = userInEvents.map((userInEvent) => userInEvent.feedback);

            res.status(200).json(feedbacks);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error fetching feedbacks for the event' });
        }
    },

  /**
   * Create a new Feedback
   * @auth none
   * @route {POST} /feedbacks
   * @body {rating, commentary} - Feedback details
   * @returns {Feedback} The created Feedback object
   */
  async createFeedback(req, res) {
    const { rating, commentary } = req.body;
    try {
      if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
      }

      const newFeedback = await prisma.feedback.create({
        data: {
          rating,
          commentary,
        },
      });

      res.status(201).json(newFeedback);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error creating feedback' });
    }
  },

  /**
   * Update an existing Feedback
   * @auth none
   * @route {PUT} /feedbacks/{id}
   * @param {String} id - Feedback ID
   * @body {rating, commentary} - Updated feedback details
   * @returns {Feedback} The updated Feedback object
   */
  async updateFeedback(req, res) {
    const { id } = req.params;
    const { rating, commentary } = req.body;
    try {
      const existingFeedback = await prisma.feedback.findUnique({
        where: { feedbackID: id },
      });

      if (!existingFeedback) {
        return res.status(404).json({ message: 'Feedback not found' });
      }

      const updatedFeedback = await prisma.feedback.update({
        where: { feedbackID: id },
        data: {
          rating,
          commentary,
        },
      });

      res.status(200).json(updatedFeedback);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating feedback' });
    }
  },

  /**
   * Delete a Feedback
   * @auth none
   * @route {DELETE} /feedbacks/{id}
   * @param {String} id - Feedback ID
   * @returns {Message} Success or failure message
   */
  async deleteFeedback(req, res) {
    const { id } = req.params;
    try {
      const existingFeedback = await prisma.feedback.findUnique({
        where: { feedbackID: id },
      });

      if (!existingFeedback) {
        return res.status(404).json({ message: 'Feedback not found' });
      }

      await prisma.feedback.delete({
        where: { feedbackID: id },
      });

      res.status(200).json({ message: 'Feedback deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting feedback' });
    }
  },

};

export default feedbackController;
