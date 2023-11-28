const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const axios = require('axios')
const Image = require("./models/Image")
const routes = require("./routes/routes") // All the routes
const URL = "mongodb+srv://vardhanvsr2004:Chantiv%40123@cluster0.um71hbz.mongodb.net/?retryWrites=true&w=majority"
const PORT = 5000
const theResponse = null;
const app = express()

app.use(express.json())
app.use(cors())
// Routes

app.use("/api", routes)

// Serve uploaded images
app.use('/images', express.static('images'));

mongoose.connect(URL)
    .then(async () => {
        // getDesc(); 
        // migrateData()
        app.listen(PORT, () => {
            console.log(`Connected to DB and listening to port ${PORT}`);
        })

    })
    .catch(err => {
        console.log(err.message);
    })

    
    // Use this somewhere
    async function getDesc() {
        const SCENE_X_KEY = '96sFBIQV6qWWe1rdDHqW:03bf20bbc5496edc4fb664172080e547fc612d07821be568b24252e7c8fe3f6d';
      
        try {
          const response = await axios.post('https://api.scenex.jina.ai/v1/describe', {
            data: [
              { image: 'https://thumbs.dreamstime.com/b/cat-playing-ball-white-background-little-86558685.jpg', features: [] },
            ]
          }, {
            headers: {
              'x-api-key': SCENE_X_KEY,
              'content-type': 'application/json'
            },
          });
      
          console.log('The data is', response.data.result[0].text); // Adjust based on the actual response structure
        } catch (error) {
          console.error('Error:', error.message);
        }
      }

      // async function migrateData() {
      //   try {
      //     // Find all documents in the collection
      //     const images = await Image.find();
      
      //     // Update each document
      //     for (const image of images) {
      //       // Transform the reviews field according to the new schema
      //       const updatedReviews = image.reviews.map((rating) => ({
      //         user: 'defaultUser', // Replace with a default user or any logic you prefer
      //         comment: '', // You may choose to set a default comment
      //         rating,
      //       }));
      
      //       // Update the document with the new reviews structure
      //       await Image.findByIdAndUpdate(image._id, { reviews: updatedReviews });
      //     }
      
      //     console.log('Data migration complete.');
      //   } catch (error) {
      //     console.error('Error during data migration:', error);
      //   }
      // }