import { Request, Response } from "express";
import { IReqAuth } from "../config/interface";
import Blogs from '../models/blogModel'
import mongoose from 'mongoose';

const Pagination = (req: IReqAuth) => {
    let page = Number(req.query.page) * 1 || 1;
    let limit = Number(req.query.limit) * 1 || 4;
    let skip = (page - 1) * limit;

    return { page, limit, skip }
}

const blogCtrl = {
    createBlog: async(req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: 'Invalid Authentication'})

        try {
            const {title, content, description, thumbnail, category} = req.body
            const newBlog = new Blogs({
                user: req.user._id,
                title, 
                content,
                description,
                thumbnail: thumbnail,
                category
            })

            await newBlog.save()
            res.json({newBlog})
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    getHomeBlogs: async(req: Request, res: Response) => {
        try {
           const blogs = await Blogs.aggregate([
            //    user
            {
                $lookup: {
                    from: 'users',
                    let: { user_id: "$user"},
                    pipeline: [
                        { $match: { $expr: { $eq: ["$_id", "$$user_id"] } } } ,
                        { $project: { password: 0 } }
                    ],
                    as: "user"
                }
            },
            //arr => obj
            { $unwind: "$user" },
            //category
            {   
                $lookup: {
                    "from": "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: "$category" },

            // sorting
            { $sort: { "createdAt": -1 } },

            //group by category 
            {
                $group: {
                    _id: "$category._id",
                    name: { $first: "$category.name" },
                    blogs: {
                        $push: "$$ROOT"
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            //panigation 
            {
                $project: {
                    blogs: {
                        $slice: ['$blogs', 0, 4]
                    },
                    count: 1,
                    name: 1
                }
            }
           ])
           res.json(blogs)
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    getBlogsByCategory: async(req: IReqAuth, res: Response) => {
        const { limit, page, skip } = Pagination(req)

        try {
            const Data = await Blogs.aggregate([
                {
                    $facet: {
                        totalData: [
                            { $match: 
                                { category: new mongoose.Types.ObjectId(req.params.category_id) } 
                            },
                            {
                                $lookup: {
                                    from: "users",
                                    let: { user_id: "$user" },
                                    pipeline: [
                                        {$match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                        {$project: {password: 0}}
                                    ],
                                    as: "user"
                                }
                            },
                            {$unwind: "$user"},
                            {
                                $sort: {createAt: -1}
                            },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        totalCount: [
                            { 
                                $match: {
                                    category: new mongoose.Types.ObjectId(req.params.category_id)
                                }
                            },
                            {$count: 'count'}
                        ],

                    }
                },
                {
                    $project: {
                        count: { $arrayElemAt: ["$totalCount.count", 0] },
                        totalData: 1
                    }
                }
            ])
            const blogs = Data[0].totalData
            const count = Data[0].count

            // Panigation
            let total = 0;
            if(count % limit === 0) {
                total = count / limit
            } else {
                total = Math.floor(count / limit) + 1
            }
            return res.json({blogs, total})
            
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    getBlogsByUser: async(req: IReqAuth, res: Response) => {
        console.log(req.params.id);
        
        const { limit, page, skip } = Pagination(req)

        try {
            const Data = await Blogs.aggregate([
                {
                    $facet: {
                        totalData: [
                            { $match: 
                                { user : new mongoose.Types.ObjectId(req.params.id) } 
                            },
                            {
                                $lookup: {
                                    from: "users",
                                    let: { user_id: "$user" },
                                    pipeline: [
                                        {$match: { $expr: { $eq: ["$_id", "$$user_id"] } } },
                                        {$project: {password: 0}}
                                    ],
                                    as: "user"
                                }
                            },
                            {$unwind: "$user"},
                            {
                                $sort: {createAt: -1}
                            },
                            { $skip: skip },
                            { $limit: limit }
                        ],
                        totalCount: [
                            { 
                                $match: {
                                    user: new mongoose.Types.ObjectId(req.params.id)
                                }
                            },
                            {$count: 'count'}
                        ],

                    }
                },
                {
                    $project: {
                        count: { $arrayElemAt: ["$totalCount.count", 0] },
                        totalData: 1
                    }
                }
            ])
            const blogs = Data[0].totalData
            const count = Data[0].count

            // Panigation
            let total = 0;
            if(count % limit === 0) {
                total = count / limit
            } else {
                total = Math.floor(count / limit) + 1
            }
            return res.json({blogs, total})
            
        } catch (error: any) {
            return res.status(500).json({msg: error.message})
        }
    },
    getBlog: async(req: IReqAuth, res: Response) => {
        try {
            const blog = await Blogs.findOne({_id: req.params.id}).populate("user", "-password")
            if(!blog) return res.status(400).json({msg: "Blog is not exist"})

            return res.json(blog)
        } catch (error: any) {
            res.status(500).json({msg: error.message})
        }
    }
}

export default blogCtrl;