import * as mongodb from "mongodb";
import { Product } from "./product.interface";
import { User } from "./user.interface";

export const collections: {
    products?: mongodb.Collection<Product>;
    users?: mongodb.Collection<User>;
} = {};

export async function connectToDatabase(uri: string) {
    const client = new mongodb.MongoClient(uri);
    await client.connect();

    const db = client.db("voyage-canvas-webshop");
    await applySchemaValidation(db);

    const productsCollection = db.collection<Product>("products");
    collections.products = productsCollection;

    const usersCollection = db.collection<User>("users");
    collections.users = usersCollection;
}

async function applySchemaValidation(db: mongodb.Db) {
    const productSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "description", "country", "price", "stock", "imageUrl"],
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
                    bsonType: "object",  
                    required: ["code", "name"],  
                    properties: {
                        code: {
                            bsonType: "string",
                            description: "'code' is required and is a string",
                        },
                        name: {
                            bsonType: "string",
                            description: "'name' is required and is a string",
                        },
                    },
                    description: "'country' is required and should be an object with 'code' and 'name'",
                },
                price: {
                    bsonType: "number",
                    description: "'price' is required and is a number",
                },
                stock: {
                    bsonType: "number",
                    description: "'stock' is required and is a number",
                },
                imageUrl: {
                    bsonType: "string",
                    description: "'imageUrl' is required",
                },
            },
        },
    };
    const userSchema = {
        $jsonSchema:{
            bsonType: "object",
            required: ["name", "email", "provider", "providerId"],
            additionalProperties: false,
            properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string",
                },
                email: {
                    bsonType: "string",
                    description: "'email' is required and is a string",
                },
                provider: {
                    bsonType: "string",
                    description: "'provider' is required and is a string",
                },
                providerId: {
                    bsonType: "string",
                    description: "'providerId' is required and is a string",
                },
            }
        }
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

    await db.command({
        collMod: "users",
        validator: userSchema
        }).catch(async (error: mongodb.MongoServerError) => {
            if (error.codeName === "NamespaceNotFound") {
                await db.createCollection("users", {validator: userSchema});
            }
    });
}
