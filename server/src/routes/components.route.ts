import { Router } from "express";
import { createComponent, deleteComponent, getComponents, updateComponent } from "../controllers/components.controller";

const router = Router();
router.get("/", getComponents);
// router.get("/:slug", getPage);
router.post("/", createComponent);
// router.patch("/:id/publish", publishPage);
router.patch("/:id/update", updateComponent);
router.delete("/:id", deleteComponent);

export default router;
