import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { User } from "../interfaces/user.interface";

export const userRouter = express.Router();
userRouter.use(express.json());

// get user by email
userRouter.get("/:email", async(req, res) => {
    try{
        const email = req?.params?.email;
        const query = { email: email };
        const user = await collections.users?.findOne(query);
        if (user) {
            res.status(200).send(user);
        } else {
            res.status(404).send(`Failed to find user: ${email}`);
        }
    } catch (error) {
        res.status(404).send(`Failed to find user: ${req?.params?.email}`);
    }
})

// create a new user by POST
userRouter.post("/", async(req, res) => {
    try {
        const newUser = req.body as User;
        const result = await collections.users?.insertOne(newUser);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new user: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new user.");
        }
    } catch (error) {
        console.error(error, "error: create a new user");
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: create a new user");
    }
})

// update user
userRouter.post("/:id", async(req, res) => {
    try {
        const id = req?.params?.id;
        const user = req.body as User;
        const query = { _id: new ObjectId(id) };
        const result = await collections.users?.updateOne(query, { $set: user });
        if (result && result.matchedCount) {
            res.status(200).send(`Updated user: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find user: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update user: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error: update a user";
        console.error(message, "Error: update a user");
        res.status(400).send(message);
    }
})

