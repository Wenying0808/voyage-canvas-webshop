import * as express from "express";
import { ObjectId } from "mongodb";
import { collections } from "./database";

export const productRouter = express.Router();
productRouter.use(express.json());

// Get unique countries
productRouter.get("/countries", async (req, res) => {
    try {
        const countries = await collections?.products?.distinct("country.name");
        res.status(200).send(countries);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error: get unique countries");
    }
})

// get all products based on filters (profuct name and selected country) from database
productRouter.get("/", async (req, res) => {
    try {
        const { nameSearch, countryFilter } = req.query;
        let query: any = {};
        if (nameSearch) {
            query.name = { $regex: nameSearch as string, $options: 'i' };
        }
        if (countryFilter && countryFilter !== 'all') {
            query['country.name'] = countryFilter;
        }
        const products = await collections?.products?.find(query).toArray();
        res.status(200).send(products);
    } catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
});

// get product by id
productRouter.get("/:id", async(req, res)=>{
    try{
        const id = req?.params?.id;
        const query = {_id: new ObjectId(id)}; // convert the string ID to a MongoDB ObjectId object
        const product = await collections?.products?.findOne(query);
        if(product){
            res.status(200).send(product)
        } else {
            res.status(404).send(`Failed to find an product: ID ${id}`);
        }
    } catch (error){
        res.status(404).send(`Failed to find an product: ID ${req?.params?.id}`);
    }
});

// create a new product by POST
productRouter.post("/", async(req,res)=>{
    try {
        const product = req.body;
        const result = await collections?.products?.insertOne(product);

        if (result?.acknowledged) {
            res.status(201).send(`Created a new product: ID ${result.insertedId}.`);
        } else {
            res.status(500).send("Failed to create a new product.");
        }
    } catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
});

// update existing product
productRouter.put("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const product = req.body;
        const query = {_id: new ObjectId(id)};
        const result = await collections?.products?.updateOne(query, { $set: product}); // set operator
    
        if (result && result.matchedCount) {
            res.status(200).send(`Updated a product: ID ${id}.`);
        } else if (!result?.matchedCount) {
            res.status(404).send(`Failed to find a product: ID ${id}`);
        } else {
            res.status(304).send(`Failed to update a product: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

// Delete a product
productRouter.delete("/:id", async (req, res) => {
    try {
        const id = req?.params?.id;
        const product = req.body;
        const query = {_id: new ObjectId(id)};
        const result = await collections?.products?.deleteOne(query);
    
        if (result && result.deletedCount) {
            res.status(200).send(`Removed a product: ID ${id}.`);
        } else if (!result) {
            res.status(400).send(`Failed to remove a product: ID ${id}`);
        } else if (!result.deletedCount){
            res.status(404).send(`Failed to find a product: ID ${id}`);
        }
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
});

