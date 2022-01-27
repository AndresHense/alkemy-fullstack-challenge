import express from 'express'
import multer from 'multer'
import path from 'path'
import { admin, protect } from '../middleware/authMiddleware.js'
import pkg from 'cloudinary'
import asyncHandler from 'express-async-handler'
const cloudinary = pkg

const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/')
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileTypeImage(file, cb) {
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}

function checkFileTypePdf(file, cb) {
  const filetypes = /pdf/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (extname && mimetype) {
    return cb(null, true)
  } else {
    cb('Images only!')
  }
}
const uploadImage = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileTypeImage(file, cb)
  },
})

const uploadPdf = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileTypePdf(file, cb)
  },
})
router.post(
  '/',
  protect,
  admin,
  uploadImage.single('image'),
  asyncHandler(async (req, res) => {
    const uploadPhoto = await cloudinary.v2.uploader.upload(`${req.file.path}`)
    res.send(uploadPhoto.url)
  })
)

router.post(
  '/partiture',
  protect,
  admin,
  uploadPdf.single('partiture'),
  asyncHandler(async (req, res) => {
    const uploadPartiture = await cloudinary.v2.uploader.upload(
      `${req.file.path}`
    )
    res.send(uploadPartiture.url)
  })
)

export default router
