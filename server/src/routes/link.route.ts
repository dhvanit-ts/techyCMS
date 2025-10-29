import { Router } from "express";
import {
  createLink,
  deleteLink,
  getLink,
  getLinksBySection,
  updateLink,
  updateLinksOrder,
} from "../controllers/link.controller";

const router = Router();
router.get("/many/section/:sectionId", getLinksBySection);
router.get("/single/:id", getLink);
router.patch("/reorder/:sectionId", updateLinksOrder);
router.post("/", createLink);
router.patch("/:id/update", updateLink);
router.delete("/:id", deleteLink);

export default router;
