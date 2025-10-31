import { Router } from "express";
import {
  createSection,
  getSection,
  getSections,
} from "../controllers/section.controller";

const router = Router();

router.get("/", getSections);
router.post("/", createSection);
router.get("/:id", getSection);

export default router;
