// Create web server with express

// Import dependencies
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

// Import mongoose
const mongoose = require('mongoose');

// Import models
const Comment = require('./models/comment');

// Create express app
const app = express();

// Configure app
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(cors());

// Connect to mongodb
mongoose.connect('mongodb://localhost:27017/comments');

// Create route
app.get('/comments', (req, res) => {
  Comment.find({}, 'title description', (error, comments) => {
    if (error) {
      console.error(error);
    }
    res.send({
      comments: comments
    });
  }).sort({_id: -1});
});

// Create route
app.post('/comments', (req, res) => {
  const db = req.db;
  const title = req.body.title;
  const description = req.body.description;
  const new_comment = new Comment({
    title: title,
    description: description
  });

  new_comment.save(function (error) {
    if (error) {
      console.log(error);
    }
    res.send({
      success: true,
      message: 'Comment saved successfully!'
    });
  });
});

// Listen on port 8081
app.listen(process.env.PORT || 8081);