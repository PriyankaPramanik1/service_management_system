require('dotenv').config()
const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const ejs = require('ejs');
const path = require('path')
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
const cors=require('cors')

const DbConnection = require('./app/config/dbCon')
DbConnection()

const flash = require('connect-flash')
const session = require('express-session')
const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(session({
  secret: 'secrect',
  cookie: { maxAge: 600000 },
  resave: false,
  saveUninitialized: false
}))

// user
app.use((req, res, next) => {
  if (req.cookies && req.cookies.userToken) {
    jwt.verify(req.cookies.userToken, process.env.JWT_SECRET || "hellowelcometowebskittersacademy123456", (err, data) => {
      if (!err) {
        res.locals.user = data;
      }
    });
  }
  next();
});

// admin
app.use((req, res, next) => {
  if (req.cookies && req.cookies.adminToken) {
    jwt.verify(req.cookies.adminToken, process.env.JWT_SECRET_ADMIN || "hellowelcomeAdmin123456", (err, data) => {
      if (!err) {
        res.locals.admin = data;
      }
    });
  }
  next();
});

// manager
app.use((req, res, next) => {
  if (req.cookies && req.cookies.managerToken) {
    jwt.verify(req.cookies.managerToken, process.env.JWT_SECRET_MANAGER || "hellowelcomeManager123456", (err, data) => {
      if (!err) {
        res.locals.manager = data;
      }
    });
  }
  next();
});

// employee
app.use((req, res, next) => {
  if (req.cookies && req.cookies.employeeToken) {
    jwt.verify(req.cookies.employeeToken, process.env.JWT_SECRET_EMPLOYEE || "hellowelcomeEmployee123456", (err, data) => {
      if (!err) {
        res.locals.employee = data;
      }
    });
  }
  next();
});

// Backend route to check authentication
app.get('/api/auth/check', async (req, res) => {
  try {
    // Check for all possible tokens
    const tokens = [
      { name: 'adminToken', secret: process.env.JWT_SECRET_ADMIN },
      { name: 'userToken', secret: process.env.JWT_SECRET },
      { name: 'managerToken', secret: process.env.JWT_SECRET_MANAGER },
      { name: 'employeeToken', secret: process.env.JWT_SECRET_EMPLOYEE }
    ];

    let user = null;

    for (const tokenInfo of tokens) {
      const token = req.cookies[tokenInfo.name];
      if (token) {
        try {
          const decoded = jwt.verify(token, tokenInfo.secret);
          user = decoded;
          break;
        } catch (err) {
          // Token is invalid, continue to next token
          continue;
        }
      }
    }

    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    res.json(user);
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.use(flash())

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, './uploads')))
app.use(express.static(path.join(__dirname, 'public')))

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true 
}));


const ejsRouter = require('./app/router/ejsRouter')
app.use(ejsRouter)
const serviceRouter=require('./app/router/serviceRoutes');
app.use(serviceRouter)
const userRouter = require('./app/router/userRouter')
app.use(userRouter)
const adminRouter = require('./app/router/adminRouter')
app.use(adminRouter)
const managerRouter = require('./app/router/managerRouter')
app.use(managerRouter)
const bookingRoute=require('./app/router/bookingRouter')
app.use(bookingRoute)
const employeeRoute=require('./app/router/employeeRouter')
app.use(employeeRoute)

const PORT = 8400
app.listen(PORT, () => {
  console.log(`Server is running this url http://localhost:${PORT}`);

})