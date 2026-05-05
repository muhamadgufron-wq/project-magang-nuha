import { Router } from "express";
import * as appointmentController from "../controllers/appointmentController";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

// Semua route appointment memerlukan login
router.use(authMiddleware as any);

router.post("/", appointmentController.createRegistration as any);
router.get("/me", appointmentController.getMyRegistrations as any);
router.patch("/:id/status", appointmentController.updateStatus as any);

export default router;
