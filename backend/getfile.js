import fs from 'fs'
import https from 'https'
import path from 'path'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()
const getFile = (url) => {
  const file = fs.createWriteStream(path.basename(url))
  const request = https.get(url, (res) => {
    res.pipe(file)
  })
}

const url = ''

let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})
const __dirname = path.resolve()
getFile(url)
let mailOptions = {
  from: process.env.EMAIL_USER,
  to: '',
  subject: 'Shop partitures',
  text: 'hey, watsup, im testing tis',
  attachments: [
    {
      filename: path.basename(url),
      path: path.join(__dirname, path.basename(url)),
    },
  ],
}
transporter.sendMail(mailOptions, (err, data) => {
  if (err) {
    console.log(err)
  } else {
    console.log('email sent!')
  }
})
