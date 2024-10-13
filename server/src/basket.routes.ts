import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";
import { Basket, BasketItem } from "./basket.interface";

export const basketRouter = express.Router();
basketRouter.use(express.json());

// Get basket by userId or sessionId
basketRouter.get("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { $or: [{ userId: id }, { sessionId: id }] };
        const basket = await collections.baskets?.findOne(query);
        if(basket){
            res.status(200).send(basket);
        } else {
            res.status(404).send(`Basket not found for Id: ${id}`);
        }
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error: get basket");
    }
})

// Create or update basket
basketRouter.post("/", async (req, res) => {
    try {
        const basket: Basket = req.body;
        const query = { $or: [{ userId: basket.userId }, { sessionId: basket.sessionId }] };
        const update = { $set: basket };
        const options = { upsert: true, returnOriginal: false }; // if no document matches the query, a new document will be created; return the modified document rather than the original

        const result = await collections.baskets?.findOneAndUpdate(query, update, options);

        if (result) {
            res.status(200).send(result);
        } else {
            res.status(500).send("Failed to create or update basket");
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: creating or updating a basket");
    }
})

// Add item to basket
basketRouter.post("/:id/items", async (req, res) => {
    try {
        const id = req.params.id;
        const item: BasketItem = req.body;
        const query = { $or: [{ userId: id }, { sessionId: id }] };
        const update = { $push: { items: item }};

        const results = await collections.baskets?.updateOne(query, update);

        if(results?.modifiedCount){
            res.status(200).send(`Added item to basket: ${id}`)
        } else {
            res.status(404).send(`Basket not found: ${id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: adding item to basket");
    }
})

// Update item Qauntity in Basket
basketRouter.put("/:id/items/:productId", async (req, res) => {
    try {
        const { id, productId } = req.params;
        const { quantity } = req.body;
        const query = {
            $or: [{ userId: id }, { sessionId: id }],
            "items.productId": productId
        }
        const update = { $set: { "items.$.quantity": quantity } };
        const result = await collections.baskets?.updateOne(query, update);

        if (result?.modifiedCount) {
            res.status(200).send(`Updated item quantity in basket: ${id}`);
        } else {
            res.status(404).send(`Basket or item not found`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: modifying the quantity for product");
    }
})

// Remove item from basket
basketRouter.delete("/:id/items/:productId", async (req, res) => {
    try {
        const { id, productId } = req.params;
        const query = {
            $or: [{ userId: id }, { sessionId: id }],
        }
        const update = { $pull: { items: { productId: productId } } }
        const result = await collections.baskets?.updateOne(query, update);

        if (result?.modifiedCount) {
            res.status(200).send(`Removed item from basket: ${id}`);
        } else {
            res.status(404).send(`Basket or item not found`);
        }

    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: removing item from basket");
    }
})

// Clear Basket
basketRouter.delete("/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const query = { $or: [{ userId: id }, { sessionId: id }] };
        const result = await collections.baskets?.deleteOne(query);
        if (result?.deletedCount) {
            res.status(200).send(`Cleared basket: ${id}`);
        } else {
            res.status(404).send(`Basket not found: ${id}`);
        }
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: deleting basket");
    }
})