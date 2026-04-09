var express = require("express")
const mongoose = require('mongoose')
var app = express()
app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Connecting to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/sit725db');
mongoose.connection.on('connected', () => {
console.log('Connected to MongoDB!');
});
//Creating a MongoDB schema
const sit725schema = new mongoose.Schema({
title: String,
image: String,
release: String,
genre: String,
description: String,
});
const projects1 = mongoose.model('Project', sit725schema);

app.get('/api/books', async (req, res) => {
const project = await projects1.find({});
res.json({ statusCode: 200, data: project, message: "Success" });
});


var PORT = process.env.port || 3000;
app.listen(PORT, () => {
console.log(`Server is running on http://localhost:${PORT}/`);
});