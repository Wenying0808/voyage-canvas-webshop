import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";
import { productRouter } from "./product.routes";
import { userRouter } from "./user.routes";
import { basketRouter } from "./basket.routes";
import passport from './auth';
import session from 'express-session';
import MongoStore from "connect-mongo";



// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config({ path: '../.env' });

const { MONGODB_URI, SESSION_SECRET } = process.env;

if (!MONGODB_URI) {
  console.error(
    "No MONGODB_URI environment variable has been defined in .env"
  );
  process.exit(1);
}

if (!SESSION_SECRET) {
  console.error(
    'SESSION_SECRET is not set in .env file'
  );
  process.exit(1);
}

connectToDatabase(MONGODB_URI)
  .then(() => {
    const app = express();

    // CORS configuration
    app.use(cors({
      origin: 'http://localhost:4200', // be replaced with the production app url
      credentials: true
    }));

    // Body parser middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ 
        mongoUrl: MONGODB_URI,
        collectionName: 'sessions' // Optional: specify the collection name
      }),
      cookie: {
        secure: process.env.NODE_ENV === 'production', // use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      }
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.use("/products", productRouter);
    app.use("/users", userRouter);
    app.use("/baskets", basketRouter);

    // Auth routes
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }),
      (req, res) => res.redirect('http://localhost:4200/account')
    );
    app.get('/api/current-user', (req, res) => {
      if (req.isAuthenticated()) {
        res.json(req.user);
      } else {
        res.status(401).json({ message: 'Not authenticated' });
      }
    });

    app.get('/logout', (req, res) => {
      req.logout(() => {
        res.redirect('/');
      });
    });

    // start the Express server
    const PORT = process.env.PORT || 5200;
    app.listen(PORT, () => { 
        console.log(`Server running at http://localhost:${PORT}...`);
    });
  })
  .catch((error) => console.error(error, "Error: connect to mongoDB"));