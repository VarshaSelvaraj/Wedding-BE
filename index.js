const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://varsha:varsha12345678@cluster0.hblbul8.mongodb.net/development?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const User = mongoose.model('User', {
  username: String,
  email: String,
  password: String,
  contactNumber: String,
});

const Booking = mongoose.model('Booking', {
  user: String,
  brideName: String,
  bph: String,
  groomName: String,
  gph: String,
  weddingDate: String,
  weddingTime: String,
  location: String,
  venueType: String,
  budget: String,
  decType: String,
  cateringType: String,
  guestCount: String,
  photography: Boolean,
  invitation: Boolean,
  entertainment: Boolean,
  styling: Boolean,
  limousine: Boolean,
  additionalComments: String,
});

const JWT_SECRET = 'lock'; // Replace with a secret key for JWT

app.post('/submit-booking', async (req, res) => {
  try {
    const {
      user,
      brideName,
      bph,
      groomName,
      gph,
      weddingDate,
      weddingTime,
      location,
      venueType,
      budget,
      decType,
      cateringType,
      guestCount,
      photography,
      invitation,
      entertainment,
      styling,
      limousine,
      additionalComments,
    } = req.body;

    const newBooking = new Booking({
      user,
      brideName,
      bph,
      groomName,
      gph,
      weddingDate,
      weddingTime,
      location,
      venueType,
      budget,
      decType,
      cateringType,
      guestCount,
      photography,
      invitation,
      entertainment,
      styling,
      limousine,
      additionalComments,
    });

    await newBooking.save();

    res.status(201).json({ message: 'Booking successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/signup', async (req, res) => {
  try {
    const { username, email, password, contactNumber } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const newUser = new User({ username, email, password, contactNumber });
    await newUser.save();

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/coachlog', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({ message: 'Invalid username or password' });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user._id }, JWT_SECRET);
      res.status(200).json({ token });
    } else {
      res.status(400).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
