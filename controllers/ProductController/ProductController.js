import multer from 'multer';
import path from 'path';
import CustomerrorHandler from '../../services/CustomerrorHandler';
import Joi from 'joi';
import { Product } from '../../models';
import fs from 'fs';
import ProductSchema from '../../validators/validators';

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        const uniquename = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;

        cb(null, uniquename);
    }
})

const handleMultipartData = multer({ storage, limits: { fileSize: 1000000 * 5 } }).single('image');

const ProductController = {
    async store(req, res, next) {

        // multipart form data
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomerrorHandler.serverError(err.message))
            }
            const filePath = req.file.path;

            // validate

            const { error } = ProductSchema.validate(req.body);

            if (error) {

                // delete image file

                fs.unlink(`${rootDir}/${filePath}`, (err) => {
                    if (err) {
                        return next(CustomerrorHandler.serverError(err.message));
                    }
                })
                return next(error);
            }

            const { name, price, size } = req.body;
            let document;
            try {
                document = await Product.create({
                    name,
                    price,
                    size,
                    image: filePath
                })
            } catch (error) {
                return next(error);
            }

            res.json(document);
        });
    },

    update(req, res, next) {
        handleMultipartData(req, res, async (err) => {
            if (err) {
                return next(CustomerrorHandler.serverError(err.message))
            }

            let filePath;
            if (req.file) {
                filePath = req.file.path;
            }

            // validate

            const { error } = ProductSchema.validate(req.body);

            if (error) {

                // delete image file
                if (req.file) {
                    fs.unlink(`${rootDir}/${filePath}`, (err) => {
                        if (err) {
                            return next(CustomerrorHandler.serverError(err.message));
                        }
                    })
                }
                return next(error);
            }

            const { name, price, size } = req.body;
            let document;
            if (req.file) {
                try {
                    const deletefile = await Product.findOne({ _id: req.params.id });
                    fs.unlink(`${rootDir}/${deletefile.image}`, (err) => {
                        if (err) {
                            return next(CustomerrorHandler.serverError(err.message));
                        }
                    })
                } catch (error) {
                    return next(CustomerrorHandler.serverError());
                }
            }
            try {
                document = await Product.findOneAndUpdate({ _id: req.params.id }, {
                    name,
                    price,
                    size,
                    ...(req.file && { image: filePath })
                }, { new: true })


            } catch (error) {
                return next(error);
            }

            res.json(document);
        });
    },

    async delete(req, res, next) {
        let document;
        try {
            document = await Product.findOneAndRemove({ _id: req.params.id });
            if (!document) {
                return next(new Error('Nothing To Delete'));
            }

            const filePath = document.image;
            fs.unlink(`${rootDir}/${filePath}`, (err) => {
                if (err) {
                    return next(CustomerrorHandler.serverError(err.message));
                }
            })

        } catch (error) {
            return next(CustomerrorHandler.serverError());
        }

        res.json(document);

    },

    async getAll(req, res, next) {
        let document;
        try {
            document = await Product.find({}).select('-__v -createdAt');

            if (!document) {
                return next(new Error('Nothing to show'));
            }
        } catch (error) {
            return next(CustomerrorHandler.serverError());
        }

        res.json(document);
    },

    async getSingleproduct(req, res, next) {
        let document;
        try {
            document = await Product.findOne({ _id: req.params.id }).select('-__v -createdAt');
            if (!document) {
                return next(new Error('No record found'));
            }
        } catch (error) {
            return next(CustomerrorHandler.serverError());
        }

        res.json(document);
    }
}

export default ProductController;