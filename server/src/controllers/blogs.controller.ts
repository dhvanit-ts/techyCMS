import { Request, Response, NextFunction } from "express";
import { ApiError, ApiResponse, AsyncHandler } from "../utils/ApiHelpers";
import prisma from "../db/index";

export const createBlog = async (
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const {
      title,
      slug,
      content,
      status,
      seoTitle,
      seoDescription,
    } = req.body;
    
    const featuredImageFile = (req as Request & { files: any }).files?.['featuredImage']?.[0];
    const metaImageFile = (req as Request & { files: any }).files?.['metaImage']?.[0];

    const newBlog = await prisma.blog.create({
      data: {
        title,
        slug,
        content,
        featuredImage: featuredImageFile?.filename,
        status,
        seoTitle,
        seoDescription,
        metaImage: metaImageFile?.filename,
      },
    });

    if (!newBlog) {
      throw new ApiError(500, "Failed to create blog");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, newBlog, "Blog created successfully"));
  } catch (error) {
    return res.status(500).json({ error: "Failed to create blog" });
  }
};

export const getBlogs = async (
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  try {
    const blogs = await prisma.blog.findMany();
    return res
      .status(200)
      .json(new ApiResponse(200, blogs, "Blogs fetched successfully"));
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

export const getBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: req.params.slug },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, blog, "Blog fetched successfully"));
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch blog" });
  }
};

export const updateBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: req.params.slug },
    });
    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }
    const updatedBlog = await prisma.blog.update({
      where: { slug: req.params.slug },
      data: req.body,
    });
    return res
      .status(200)
      .json(new ApiResponse(200, updatedBlog, "Blog updated successfully"));
  } catch (error) {
    return res.status(500).json({ error: "Failed to update blog" });
  }
};

export const deleteBlog = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { slug: req.params.slug },
    });
    if (!blog) {
      throw new ApiError(404, "Blog not found");
    }
    const deletedBlog = await prisma.blog.delete({
      where: { slug: req.params.slug },
    });
    return res
      .status(200)
      .json(new ApiResponse(200, deletedBlog, "Blog deleted successfully"));
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete blog" });
  }
};
