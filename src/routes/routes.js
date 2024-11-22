import { Router } from "express";
import userInEventController from "../controllers/userInEventController.js";
import feedbackController from "../controllers/feedbackController.js";

const router = Router();

// UserInEvents Routes
router.get('/tickets', userInEventController.getAllUserInEvents);
router.get('/tickets/:id', userInEventController.getUserInEventById);
router.post('/tickets', userInEventController.createUserInEvent);
router.put('/tickets/:id', userInEventController.updateUserInEvent);
router.delete('/tickets/:id', userInEventController.deleteUserInEvent);
//rota do ticket qr code

// Feedback Routes
router.get('/feedbacks', feedbackController.getAllFeedbacks);
router.get('/feedbacks/:id', feedbackController.getFeedbackById);
router.post('/feedbacks', feedbackController.createFeedback);
router.put('/feedbacks/:id', feedbackController.updateFeedback);
router.delete('/feedbacks/:id', feedbackController.deleteFeedback);
router.get('/feedbacks/event/:eventId', feedbackController.getEventFeedbacks);

export default router;