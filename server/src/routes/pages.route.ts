import { Router } from "express";
import { deletePage, getPage, getPages, publishPage, savePage, updatePage } from "../controllers/pages.controller";

const router = Router();
router.get("/", getPages);
router.get("/:slug", getPage);
router.post("/", savePage);
router.patch("/:id/publish", publishPage);
router.patch("/:id/update", updatePage);
router.delete("/:slug", deletePage);

export default router;
