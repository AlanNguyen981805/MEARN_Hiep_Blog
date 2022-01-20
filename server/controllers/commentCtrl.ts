import { Response, Request } from "express";
import { IReqAuth } from "../config/interface";
import Comments from "../models/commentModel";
import mongoose from "mongoose"

const Pagination = (req: IReqAuth) => {
    let page = Number(req.query.page) * 1 || 1;
    let limit = Number(req.query.limit) * 1 || 4;
    let skip = (page - 1) * limit;
  
    return { page, limit, skip };
  }

const commentCtrl = {
    createComment: async (req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: "Invalid Authentication"})
        try {
            const {
                content,
                blog_id,
                blog_user_id
            } = req.body
            const newComment = new Comments({
                user: req.user._id, 
                content,
                blog_id,
                blog_user_id
            })
            await newComment.save()

            return res.json(newComment)
        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    },
    getComment: async (req: Request, res: Response) => {
        const { limit, skip } = Pagination(req)
        try {
            const data = await Comments.aggregate([
                {
                    $facet: {
                        totalData: [
                        {
                            $match: {
                                blog_id: new mongoose.Types.ObjectId(req.params.id)
                            },
                        },{
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                as: "user"
                            }
                        }, {
                            $unwind: "$user"
                        }, {
                            $sort: { createAt: -1 }
                        }, {
                            $skip: skip,
                        }, {
                            $limit: limit
                        }],
                        totalCount: [
                            { $match: {
                                blog_id: new mongoose.Types.ObjectId(req.params.id)
                            }},
                            { $count: 'count' }
                        ]
                    }
                },
                {
                    $project: {
                        count: { $arrayElemAt: ["$totalCount.count", 0] },
                        totalData: 1
                    }
                }
            ])
            const comments = data[0].totalData
            const count = data[0].count

            let total = 0;

            if(count % limit === 0) {
                total = count / limit 
            } else {
                total = Math.floor(count / limit) + 1   
            }

            return res.json({comments, total})
        } catch (error: any) {
            return res.status(500).json({ msg: error.message })
        }
    }
}

export default commentCtrl