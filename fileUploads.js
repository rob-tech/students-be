const express = require("express");
const router = express.Router();
const multer = require('multer')
const { join } = require('path');
const fs = require('fs')



const studentsFile = join(__dirname, './public/img');
const upload = multer({}); // return (req, res, next)=> {}


router.post('/:id/uploads', upload.single('pic'), (req, res) => {
    fs.writeFileSync(join(studentsFile, req.params.id + "." + req.file.originalname.split(".") [1]), req.file.buffer);
    res.send("ok");
});



module.exports = router;