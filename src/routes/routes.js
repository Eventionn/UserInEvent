import { Router } from "express";
import userInEventController from "../controllers/userInEventController.js";
import feedbackController from "../controllers/feedbackController.js";
import {verifyToken }from "../middlewares/authMiddleware.js";

const router = Router();

// UserInEvents Routes
router.get('/tickets', userInEventController.getAllUserInEvents);
router.get('/tickets/my', verifyToken, userInEventController.getUserTickets);
//router.get('/tickets/my', userInEventController.getUserTickets);
router.get('/tickets/:id', userInEventController.getUserInEventById);
router.post('/tickets', verifyToken, userInEventController.createUserInEvent);
//router.post('/tickets', userInEventController.createUserInEvent);
router.put('/tickets/:id', userInEventController.updateUserInEvent);
router.put('/tickets/:id/participation', userInEventController.updateUserParticipationInEvent);
router.delete('/tickets/:id', userInEventController.deleteUserInEvent);
//rota do ticket qr code

// Feedback Routes
router.get('/feedbacks', feedbackController.getAllFeedbacks);
router.get('/feedbacks/:id', feedbackController.getFeedbackById);
router.post('/feedbacks', verifyToken, feedbackController.createFeedback);
//router.post('/feedbacks/:ticketID', feedbackController.createFeedback);
router.put('/feedbacks/:id', feedbackController.updateFeedback);
router.delete('/feedbacks/:id', feedbackController.deleteFeedback);
router.get('/feedbacks/event/:eventId', feedbackController.getEventFeedbacks);

export default router;