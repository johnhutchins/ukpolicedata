const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 5000

//what is the difference between these two?
app.use(express.static('public'))
app.use(express.static(path.join(__dirname,'/public')))

app.use('/ukData', (req,res)=>{
    res.send('/ukData.html')
})