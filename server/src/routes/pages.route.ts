import { Router } from "express";
import { deletePage, getPage, getPages, publishPage, savePage, updatePage, updatePageSettings } from "../controllers/pages.controller";

const router = Router();
router.get("/", getPages);
router.get("/:slug", getPage);
router.post("/", savePage);
router.patch("/:slug/publish", publishPage);
router.patch("/:slug/update", updatePage);
router.patch("/:id/update-settings", updatePageSettings);
router.delete("/:slug", deletePage);

export default router;
