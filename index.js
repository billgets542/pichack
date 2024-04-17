const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


// Connect to MongoDB
// 

mongoose.connect('mongodb+srv://getsbill542:WR5wMq5UKnkQl9Lh@cluster0.kcfgbrh.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0/captured_images', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', ()=>{
    console.log("Mongodb successfully connected");
});

// Define a schema for the image data
const imageSchema = new mongoose.Schema({
  imageData: String
});
const Image = mongoose.model('Image', imageSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var images = [];
var url;

// Endpoint to save image data to the database
app.post('/api/save-image', async (req, res) => {
  try {
    const imageData = req.body.imageData;
    images.push({"image":imageData});
    const newImage = new Image({ imageData });
    await newImage.save();
    res.status(201).json({ message: 'Image data saved successfully.' });
  } catch (error) {
    console.error('Error saving image data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/getimage', (req, res)=>{
    res.send(images);
});

app.post('/seturl', (req,res)=>{
    url = req.body.url;
    console.log("URL set successfully");
    res.send({"msg":"URL set successfully"});
});

app.get('/geturl', (req,res)=>{
    res.send({"url": url});
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
