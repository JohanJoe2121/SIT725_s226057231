const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/sit725db');

const sit725schema = new mongoose.Schema({
title: String,
image: String,
release: String,
genre: String,
description: String,
});
const projects1 = mongoose.model('projects', sit725schema);

const sampleproject1 = new projects1(
    {
    title: "To Kill a Mockingbird", 
    image: "images/book3.png",
    release:"1960",
    genre:"Bildungsroman", 
    description: "A powerful story set in the American South that explores themes of racial injustice, morality, and growing up through the eyes of a young girl named Scout." 
  }
);

const sampleproject2 = new projects1(
    {
    title: "1984", 
    image: "images/book4.png",
    release:"1949",
    genre:"Social Satire", 
    description: "A dystopian novel that portrays a society under constant surveillance, where freedom is restricted and truth is controlled by a powerful government. It highlights the dangers of totalitarianism and loss of individuality." // ! Replace with your second book description
  }
);


sampleproject1.save()
sampleproject2.save().then(() => {
  console.log("Sample project is saved!");
  mongoose.connection.close();
});