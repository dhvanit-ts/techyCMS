import { Router } from "express";
import {
  createBlog,
  getBlogs,
  deleteBlog,
  getBlog,
  updateBlog,
} from "../controllers/blogs.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();
router.post(
  "/",
  upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "metaImage", maxCount: 1 },
  ]),
  createBlog
);
router.patch(
  "/:id",
  upload.fields([
    { name: "featuredImage", maxCount: 1 },
    { name: "metaImage", maxCount: 1 },
  ]),
  updateBlog
);
router.get("/:slug", getBlog);
router.get("/", getBlogs);
router.delete("/:slug", deleteBlog);    

export default router;
