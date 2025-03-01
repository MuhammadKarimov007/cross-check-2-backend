const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const PRODUCTS_TABLE_NAME = process.env.PRODUCTS_TABLE_NAME;
const STOCKS_TABLE_NAME = process.env.STOCKS_TABLE_NAME;

module.exports.handler = async () => {
  try {
    const productsResult = await docClient.send(new ScanCommand({ TableName: PRODUCTS_TABLE_NAME }));
    const products = productsResult.Items || [];

    const stocksResult = await docClient.send(new ScanCommand({ TableName: STOCKS_TABLE_NAME }));
    const stocks = stocksResult.Items || [];

    const productList = products.map((product) => {
      const stock = stocks.find((s) => s.product_id === product.id);
      return {
        id: product.id,
        title: product.title,
        description: product.description,
        price: product.price,
        count: stock ? stock.count : 0,
      };
    });

    console.log("Product list retrieved successfully:", productList);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(productList),
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
};