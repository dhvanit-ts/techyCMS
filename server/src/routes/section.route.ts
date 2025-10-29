import { Router } from "express";
import {
  createSection,
  getSections,
} from "../controllers/section.controller";

const router = Router();

router.get("/", getSections);
router.post("/", createSection);

export default router;
