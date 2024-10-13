import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const basketRouter = express.Router();
basketRouter.use(express.json());