import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { Basket, BasketItem } from "../interfaces/basket.interface";

export const basketRouter = express.Router();
basketRouter.use(express.json());

// Create a new basket
basketRouter.post("/", async (req, res) => {
    
    console.log("Received POST request to /baskets");
    console.log("Request body:", req.body);

    try {
        const userId = req.body.userId;
        if (!userId) {
            return res.status(400).send("User ID is required in order to create a new empty basket");
        }

        // check if there is already a basket for the user 
        const existingBasket = await collections.baskets?.findOne({ userId: userId })
        console.log("existingBasket", existingBasket);

        // if a basket already exists, return a message
        if (existingBasket) {
            return res.status(400).send("A basket already exists for this user.");
        }
        // otherwise, create a new basket
        const newBasket: Basket = {
            _id: new ObjectId(),
            userId,
            items: []
        };
        const result = await collections.baskets?.insertOne(newBasket);

        if (result?.insertedId) {
            res.status(201).send({ message: "Basket doc created successfully in mongodb", basketId: result.insertedId });
        } else {
            res.status(500).send("Failed to create basket");
        }
       
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: creating a new basket");
    }
})

// Get basket by userId
basketRouter.get("/:userId", async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) {
            return res.status(400).send("User ID is required");
        }
        const basket = await collections.baskets?.findOne({ userId });
        if(basket){
            res.status(200).send(basket);
        } else {
            res.status(404).send(`Basket not found for userId: ${userId}`);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error: get basket");
    }
})

// Add item to basket
basketRouter.post("/:userId/items", async (req, res) => {
    try {
        const userId = req.params.userId;
        const item: BasketItem = req.body;

        if (!item.productId || !item.quantity) {
            return res.status(400).send("Product ID and quantity are required");
        }

        // find the basket by userId
        const basket = await collections.baskets?.findOne({ userId });

        if (!basket) {
            return res.status(404).send(`Basket not found for userId: ${userId}`);
        }
        // Check if the item already exists in the basket
        const existingItemIndex = basket.items.findIndex(i => i.productId === item.productId);

        let update;
        if (existingItemIndex !== -1) {
            // If the item exists, increase the quantity
            update = { $inc: { [`items.${existingItemIndex}.quantity`]: item.quantity } };
        } else {
            // If the item doesn't exist, add it to the basket
            update = { $push: { items: item } };
        }

        const result = await collections.baskets?.updateOne({ userId }, update);

        if(result?.modifiedCount){
            res.status(200).send(`Added item to basket for userId: ${userId}`)
        } else {
            res.status(404).send(`Failed to update basket for userId: ${userId}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: adding item to basket");
    }
})

// Update item Qauntity in Basket
basketRouter.put("/:userId/items/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { quantity } = req.body;

        if (typeof quantity !== 'number' || quantity < 1) {
            return res.status(400).send("Invalid quantity");
        }

        const query = { userId: userId, "items.productId": productId };
        const update = { $set: { "items.$.quantity": quantity } };
        const result = await collections.baskets?.updateOne(query, update);

        if (result?.modifiedCount) {
            res.status(200).send(`Updated item quantity in basket for userId: ${userId}`);
            res.status(200).send(`Updated quantity of item: ${update}`);
        } else {
            res.status(404).send(`Basket or item not found`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: modifying the quantity for basket item");
    }
})

// Remove item from basket
basketRouter.delete("/:userId/items/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const query = { userId: userId };
        const update = { $pull: { items: { productId } } };
        const result = await collections.baskets?.updateOne(query, update);

        if (result?.modifiedCount) {
            res.status(200).send(`Removed item from basket for userid: ${userId}`);
        } else {
            res.status(404).send(`Error removing item from basket: Basket or item not found`);
        }

    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: removing item from basket");
    }
})

