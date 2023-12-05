const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const axios = require('axios')
const Image = require("./models/Image")
const routes = require("./routes/routes") // All the routes
const URL = "mongodb+srv://vardhanvsr2004:Chantiv%40123@cluster0.um71hbz.mongodb.net/?retryWrites=true&w=majority"
const PORT = 5000

const app = express()

const session = require("express-session");
const MongoStore = require("connect-mongo"); // Import connect-mongo

app.use(express.json())
app.use(cors())
// Routes
app.use(
  session({
    secret: "Raghu-Vardhan",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: URL }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
    user:  null
  })
);
app.use("/api", routes)

// localhost:5000/api/....

// Serve uploaded images
app.use('/images', express.static('images'));


mongoose.connect(URL)
    .then(() => {
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
