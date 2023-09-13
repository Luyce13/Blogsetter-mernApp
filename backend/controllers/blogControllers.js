const asyncHandler = require("express-async-handler");
const Blog = require("../models/blogModel");
const User = require("../models/userModel");

const getBlogs = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 0;

    const limit = 5;
    const skip = page * limit;

    const totalBlogs = await Blog.countDocuments();
    const totalPages = Math.ceil(totalBlogs / limit)-1;

    if (req.query.page < 0 || req.query.page > totalPages) {
      return res
        .status(400)
        .json(`Invalid Page Number.Total Number Of Pages = ${totalPages} !!!Starting From 0!!!`);
    }

    const blogs = await Blog.find().sort({createdAt:-1}).skip(skip).limit(limit);

    res.status(200).json(blogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const getBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog post not found" });
    }

    res.status(200).json({
      id: blog.id,
      title: blog.title,
      subTitle: blog.subTitle,
      description: blog.description,
      tags: blog.tags,
    });
  } catch (error) {
    // Handle any database or other errors that might occur
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const searchBlog = asyncHandler(async (req, res) => {
  const { query } = req.query;
  try {
    const blogs = await Blog.find({
      title: { $regex: new RegExp(query, "i") },
    });
    res.json({ blogs });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

const setBlog = asyncHandler(async (req, res) => {
  if (
    !req.body.title ||
    !req.body.subTitle ||
    !req.body.description ||
    !req.body.tags
  ) {
    res.status(400);
    throw new Error("Please Add All Fields");
  }
  try {
    const blog = await Blog.create({
      title: req.body.title,
      subTitle: req.body.subTitle,
      description: req.body.description,
      tags: req.body.tags,
      user: req.user.id,
    });
    res.status(201).json(blog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const updateBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog Not Found" });
    }

    if (blog.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "User Not Authorized" });
    }

    // Validate and sanitize req.body data here if necessary

    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedBlog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const deleteBlog = asyncHandler(async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({ error: "Blog Not Found" });
    }

    if (!req.user || blog.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "User Not Authorized" });
    }

    await Blog.findByIdAndRemove(req.params.id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = {
  getBlogs,
  getBlog,
  searchBlog,
  setBlog,
  updateBlog,
  deleteBlog,
};
