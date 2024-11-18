import { Router } from "express";
import userInEventController from "../controllers/userInEventController.js";

const router = Router();

router.get('/', userInEventController.getAllUserInEvents);
router.post('/', userInEventController.createUserInEvent);

export default router;