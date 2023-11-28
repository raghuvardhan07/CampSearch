const router = require("express").Router();
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Image = require("../models/Image");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

// Routes

router.route('/getAllImages').get(async (req, res) => {
  Image.find()
    .then((images) => res.json(images))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route("/getImageById/:id").get(async (req, res) => {
  const imageId = req.params.id; // Assuming the _id is sent as a query parameter
  Image.findOne({ _id: imageId })
    .then(image => {
      if (!image) {
        return res.status(404).json({ error: 'Image not found' });
      }

      // If the image is found, you can send it back to the client
      res.json(image);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});

router.route("/upload").post(upload.single('photo'), async (req, res) => {
  const { uploadedBy, location, description } = req.body;
  console.log(req.file.filename);
  

  const newImage = new Image({
    uploadedBy,
    location,
    description,
    imagePath: req.file.filename
  });

  newImage
    .save()
    .then(() => res.json(newImage))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Reviews

// Get reviews for a specific image
router.route('/getReviewsByImageId/:id').get(async (req, res) => {
  const imageId = req.params.id;

  try {
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Return the reviews for the image
    res.json({ reviews: image.reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Post a review for a specific image
router.route('/postReview/:id').post(async (req, res) => {
  const imageId = req.params.id;
  const { user, comment, rating } = req.body;

  try {
    console.log(user);
    console.log(comment);
    console.log(rating);
    const image = await Image.findById(imageId);

    if (!image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    // Add the new review to the reviews array
    console.log(image.reviews);
    image.reviews.push({ user, comment, rating });

    // Save the updated image with the new review
    const updatedImage = await image.save();

    res.json({ reviews: updatedImage.reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;