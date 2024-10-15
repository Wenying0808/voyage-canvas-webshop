import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "../database";
import { Basket, BasketItem } from "../interfaces/basket.interface";

export const basketRouter = express.Router();
basketRouter.use(express.json());

// Create a new basket
basketRouter.post("/", async (req, res) => {
    try {
        const basket: Basket = req.body;

        // check if there is already a basket for the user or session
        const existingBasket = await collections.baskets?.findOne(
            {
                $or: [{ userId: basket.userId }, { sessionId: basket.sessionId }]
            }
        )

        // if a basket already exists, return a message
        if (existingBasket) {
            return res.status(400).send("A basket already exists for this user or session.");
        }
        // otherwise, create a new basket
        const result = await collections.baskets?.insertOne(basket);
        if (result?.insertedId) {
            res.status(201).send({ message: "Basket created successfully", basketId: result.insertedId });
        } else {
            res.status(500).send("Failed to create basket");
        }

       
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: creating a new basket");
    }
})

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

// Add item to basket
basketRouter.post("/:id/items", async (req, res) => {
    try {
        const id = req.params.id;
        const item: BasketItem = req.body;
        const query = { $or: [{ userId: id }, { sessionId: id }] };

        // Check if the item already exists in the basket
        const basket = await collections.baskets?.findOne(query);
        const existingItem = basket?.items.find(i => i.product._id === item.product._id);

        let update;
        if (existingItem) {
            // If the item exists, increase the quantity
            update = { $inc: { "items.$[elem].quantity": item.quantity } };
        } else {
            // If the item doesn't exist, add it to the basket
            update = { $push: { items: item }};
        }

        const options = existingItem ? { arrayFilters: [{ "elem.productId": item.product._id }] } : {};
        const result = await collections.baskets?.updateOne(query, update, options);

        if(result?.modifiedCount){
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
        const update = { $pull: { items: { product: { _id: productId } } } }
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

/*
// Merge session basket with user basket
basketRouter.post("/merge/:sessionId/:userId", async (req, res) => {
    try {
        const { sessionId, userId } = req.params;
        
        // Find session basket
        const sessionBasket = await collections.baskets?.findOne({ sessionId });
        
        if (!sessionBasket) {
            return res.status(404).send(`Session basket not found: ${sessionId}`);
        }
        
        // Find or create user basket
        let userBasket = await collections.baskets?.findOne({ userId });
        
        if (!userBasket) {
            userBasket = { userId, items: [] };
            await collections.baskets?.insertOne(userBasket);
        }
        
        // Merge items
        for (const sessionItem of sessionBasket.items) {
            const existingItem = userBasket.items.find(item => item.productId === sessionItem.productId);
            if (existingItem) {
                existingItem.quantity += sessionItem.quantity;
            } else {
                userBasket.items.push(sessionItem);
            }
        }
        
        // Update user basket
        await collections.baskets?.updateOne({ userId }, { $set: { items: userBasket.items } });
        
        // Delete session basket
        await collections.baskets?.deleteOne({ sessionId });
        
        res.status(200).send(`Merged session basket with user basket: ${userId}`);
    } catch (error) {
        res.status(400).send(error instanceof Error ? error.message : "Unknown error: merging baskets");
    }
});
*/