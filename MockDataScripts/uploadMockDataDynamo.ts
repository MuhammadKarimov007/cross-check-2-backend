import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";


const client = new DynamoDBClient({ region: "ap-southeast-1" });
const docClient = DynamoDBDocumentClient.from(client);


const products = [
    { title: "Laptop", description: "Gaming Laptop", price: 1500 },
    { title: "Smartphone", description: "Flagship Phone", price: 999 },
    { title: "Headphones", description: "Noise Cancelling", price: 299 },
];

async function seedDatabase() {
    console.log("Seeding database...");

    for (const product of products) {
        const productId = uuidv4();

        
        await docClient.send(
            new PutCommand({
                TableName: "products",
                Item: {
                    id: productId,
                    title: product.title,
                    description: product.description,
                    price: product.price,
                },
            })
        );
        console.log(`Inserted product: ${product.title} (${productId})`);

        
        await docClient.send(
            new PutCommand({
                TableName: "stocks",
                Item: {
                    product_id: productId,
                    count: Math.floor(Math.random() * 20) + 1,
                },
            })
        );
        console.log(`Inserted stock for product: ${product.title}`);
    }

    console.log("Database seeding complete!");
}

seedDatabase().catch(console.error);