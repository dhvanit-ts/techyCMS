import { Router } from "express";
import { getComponents } from "../controllers/components.controller";

const router = Router();
router.get("/", getComponents);
// router.get("/:slug", getPage);
// router.post("/", savePage);
// router.patch("/:id/publish", publishPage);
// router.patch("/:id/update", updatePage);
// router.delete("/:slug", deletePage);

export default router;
