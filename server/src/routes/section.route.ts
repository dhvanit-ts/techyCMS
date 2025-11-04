import { Router } from "express";
import {
  createSection,
  getSection,
  getSections,
  updateSection,
} from "../controllers/section.controller";

const router = Router();

router.get("/", getSections);
router.post("/", createSection);
router.get("/:id", getSection);
router.patch("/:id", updateSection);

export default router;
