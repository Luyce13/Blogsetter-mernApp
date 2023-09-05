const asyncHandler = require('express-async-handler')
const Blog = require('../models/blogModel')
const User = require('../models/userModel')

const getBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find({ user: req.user.id })
    res.status(200).json(blogs)
})

const getBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id, req.body, { user: req.user.id })
    res.status(200).json({ id: blog.id, title: blog.title, subTitle: blog.subTitle, description: blog.description, tags: blog.tags })
})

const setBlog = asyncHandler(async (req, res) => {
    if (!req.body.title || !req.body.subTitle || !req.body.description || !req.body.tags) {
        res.status(400)
        throw new Error('Please Add All Fields')
    }
    const blog = await Blog.create({ title: req.body.title, subTitle: req.body.subTitle, description: req.body.description, tags: req.body.tags, user: req.user.id })
    res.status(201).json(blog)
})

const updateBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        res.status(400)
        throw new Error('Blog Not Found')
    }
    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(401)
        throw new Error('User Not Found')
    }
    if (blog.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User Not Authorized')
    }
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updatedBlog)
})

const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id)
    if (!blog) {
        res.status(400)
        throw new Error('Blog Not Found')
    }
    const user = await User.findById(req.user.id)
    if (!user) {
        res.status(401)
        throw new Error('User Not Found')
    }
    if (blog.user.toString() !== user.id) {
        res.status(401)
        throw new Error('User Not Authorized')
    }
    await Blog.findByIdAndRemove(req.params.id)
    res.status(200).json(req.params.id)
})

module.exports = { getBlogs, getBlog, setBlog, updateBlog, deleteBlog }