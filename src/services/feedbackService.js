import { prisma } from '../prismaClient.js';

const feedbackService = {
  async getAllFeedbacks() {
    return prisma.feedback.findMany();
  },

  async getFeedbackById(id) {
    return prisma.feedback.findUnique({
      where: { feedbackID: id },
    });
  },

  async createFeedback(data) {
    return prisma.feedback.create({
      data,
    });
  },

  async updateFeedback(id, data) {
    return prisma.feedback.update({
      where: { feedbackID: id },
      data,
    });
  },

  async deleteFeedback(id) {
    return prisma.feedback.delete({
      where: { feedbackID: id },
    });
  },

  async getEventFeedbacks(eventId) {
    const userInEvents = await prisma.userInEvent.findMany({
      where: {
        event_id: eventId,
        feedback_id: { not: null },
      },
      include: {
        feedback: true,
      },
    });

    return userInEvents.map((userInEvent) => userInEvent.feedback);
  },
};

export default feedbackService;
