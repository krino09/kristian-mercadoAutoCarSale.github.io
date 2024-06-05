const express = require('express')
const mongoose = require('mongoose')
const app = express();
const bodyParser = require('body-parser');
const catchAsync = require('./utils/catchAsync');
const path = require('path')
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError');
// const { title } = require('process');
const Car = require('./models/product'); //for search
const flash = require('connect-flash');
const session = require('express-session');
const LocalStrategy = require('passport-local')
const passport = require('passport')
const port = 6900;
const User = require('./models/user')

const userRoute = require('./routes/users')
const products = require('./routes/products');
const reviews = require('./routes/reviews');

mongoose.connect('mongodb://127.0.0.1:27017/autoCarSale')
  .then(() => {
    console.log("MONGO CONNECTION OPEN!")
  })

  .catch(err => {
    console.log("MONGO CONNECTION ERROR!")
    console.log(err)
  })

app.use(express.static(path.join(__dirname, 'public')))
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.engine('ejs', ejsMate)
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());

// const updateOldImagePaths = async () => {
//   const cars = await Car.find({});
//   cars.forEach(async car => {
//       if (car.pictureInside && !car.pictureInside.startsWith('assets/images/')) {
//           car.pictureInside = `assets/images/${car.pictureInside}`;
//       }
//       if (car.pictureOutside && !car.pictureOutside.startsWith('assets/images/')) {
//           car.pictureOutside = `assets/images/${car.pictureOutside}`;
//       }
//       await car.save();
//   });
// };

// updateOldImagePaths().then(() => {
//   console.log('Old image paths updated');
// });

const sessionConfig = {
  secret: 'thisshouldbeabettersecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7
  }
}
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  res.locals.currentUser = req.user //
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error')
  next();
})

app.use('/', userRoute)
app.use('/cars', products)
app.use('/cars/:id/reviews', reviews)

// HOME PAGE

app.get('/', (req, res) => {
  res.render('home');
})

// SEARCH

app.get('/search', catchAsync(async (req, res) => {
  const query = req.query.query;
  console.log(`Search query: ${query}`);

  if (!query) {
    res.render('cars/searchResults', { searchResults: [], query });
    return;
  }

  try {
    const searchResults = await Car.find({
      $or: [
        { make: new RegExp(query, 'i') },
        { model: new RegExp(query, 'i') },
        { VIN: new RegExp(query, 'i') },
      ]
    });
    res.render('cars/searchResults', { searchResults, query });
  } catch (err) {
    res.status(500).send(err.message);
  }
}));


//check error on URL
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
  const { statusCode = 500, message = 'Somethng went wrong' } = err;
  if (!err.message) err.message = 'Oh no, Something Went Wrong'
  res.status(statusCode).render('error', { err })
})

app.listen(port, () => {
  console.log(`Listineng to port ${port}`)
})