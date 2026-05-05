import { Router } from "express";
import * as doctorController from "../controllers/doctorController";

const router = Router();

router.get("/", doctorController.getDoctors);
router.get("/specializations", doctorController.getSpecializations);
router.get("/:id", doctorController.getDoctorById);

export default router;
