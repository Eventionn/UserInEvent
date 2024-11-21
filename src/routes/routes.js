import { Router } from "express";
import userInEventController from "../controllers/userInEventController.js";

const router = Router();

// UserInEvents Routes
router.get('/userinevents', userInEventController.getAllUserInEvents);
router.get('/userinevents/:id', userInEventController.getUserInEventById);
router.post('/userinevents', userInEventController.createUserInEvent);
router.put('/userinevents/:id', userInEventController.updateUserInEvent);
router.delete('/userinevents/:id', userInEventController.deleteUserInEvent);

// Feedback Routes

export default router;