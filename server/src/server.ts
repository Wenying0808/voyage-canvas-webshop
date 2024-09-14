import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectToDatabase } from "./database";

// Load environment variables from the .env file, where the ATLAS_URI is configured
dotenv.config({ path: '../.env' });

const { MONGODB_URI } = process.env;
console.log("MONGODB_URI:", process.env.MONGODB_URI);

if (!MONGODB_URI) {
  console.error(
    "No MONGODB_URI environment variable has been defined in config.env"
  );
  process.exit(1);
}

connectToDatabase(MONGODB_URI)
  .then(() => {
    const app = express();
    app.use(cors());

    // start the Express server
    app.listen(5200, () => {
      console.log(`Server running at http://localhost:5200...`);
    });
  })
  .catch((error) => console.error(error));