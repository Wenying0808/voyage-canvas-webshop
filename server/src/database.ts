import * as mongodb from "mongodb";
import { Product } from "./product.interface";

export const collections: {
    products?: mongodb.Collection<Product>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("voyage-canvas-webshop");
    await applySchemaValidation(db);

    const productsCollection = db.collection<Product>("products");
    collections.products = productsCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const productSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "description", "country", "price", "stock", "imageUrls"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                description: {
                    bsonType: "string",
                    description: "'description' is required and is a string",
                },
                country: {
                    bsonType: "string",
                    description: "'country' is required and is a string",
                },
                price: {
                    bsonType: "number",
                    description: "'price' is required and is a number",
                },
                stock: {
                    bsonType: "number",
                    description: "'stock' is required and is a number",
                },
                imageUrls: {
                    bsonType: "array",
                    description: "'imageUrls' is required",
                },
            },
        },
    };

    // Try applying the modification to the collection, if the collection doesn't exist, create it
   await db.command({
    collMod: "products",
    validator: productSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === "NamespaceNotFound") {
            await db.createCollection("products", {validator: productSchema});
        }
    });
}
