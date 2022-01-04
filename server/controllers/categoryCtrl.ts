import { Request, Response } from "express";
import { IReqAuth } from "../config/interface";
import Categories from './../models/categoryModel'

const categoryCtrl = {
    createCategory: async(req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: 'Authentication invalid'})
        
        if(req.user.role !== 'admin') return res.status(400).json({msg: "Khong co quyen tao"})

        try {
            const name = req.body.name.toLowerCase()
            const category = await Categories.findOne({name})

            if(category) 
                return res.status(400).json({msg: 'Category already exists'})

            const newCategory = new Categories({name})
            await newCategory.save()

            res.json({newCategory})
            
        } catch (err: any) {
            let errMsg;

            if(err.code === 11000){
                errMsg = Object.values(err.keyValue)[0] + " already exists."
              }else{
                let name = Object.keys(err.errors)[0]
                errMsg = err.errors[`${name}`].message
              }
        
              return res.status(500).json({ msg: errMsg })
        }
    },
    getCategories:async (req:IReqAuth, res: Response) => {
        try {
            const categories = await Categories.find().sort("-createAt")
            res.json({categories})
        } catch (error) {
            return res.status(500).json({msg: error})
        }
    },
    updateCategory:async (req:IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: 'Authentication invalid'})
        
        if(req.user.role !== 'admin') return res.status(400).json({msg: "Khong co quyen tao"})
        try {
            const category = await Categories.findOneAndUpdate({_id: req.params.id}, {
                name: req.body.name
            })
            res.json({msg: 'Update success'})
        } catch (error) {
            return res.status(500).json({msg: error})
        }
    },
    deleteCategory: async(req: IReqAuth, res: Response) => {
        if(!req.user) return res.status(400).json({msg: 'Authentication invalid'})
        
        if(req.user.role !== 'admin') return res.status(400).json({msg: "Khong co quyen tao"})
        try {
            const category = await Categories.findByIdAndDelete(req.params.id)
            res.json({msg: 'Delete success'})
        } catch (error) {
            return res.status(500).json({msg: error})
        }
    }
}

export default categoryCtrl