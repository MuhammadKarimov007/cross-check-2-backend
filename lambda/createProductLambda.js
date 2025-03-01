const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const STOCKS_TABLE_NAME = process.env.STOCKS_TABLE_NAME;

module.exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);

    if (!requestBody.title || !requestBody.description || !requestBody.price || requestBody.count === undefined) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    const productId = uuidv4();

    const newProduct = {
      id: productId,
      title: requestBody.title,
      description: requestBody.description,
      price: requestBody.price,
    };

    const newStock = {
      product_id: productId,
      count: requestBody.count,
    };

    await Promise.all([
      docClient.send(new PutCommand({ TableName: PRODUCTS_TABLE_NAME, Item: newProduct })),
      docClient.send(new PutCommand({ TableName: STOCKS_TABLE_NAME, Item: newStock })),
    ]);

    console.log("Product and stock saved successfully:", newProduct, newStock);

    return {
      statusCode: 201,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({ ...newProduct, count: newStock.count }),
    };
  } catch (error) {
    console.error("Error creating product:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};