const { handler } = require("../lambda/getProductByIdLambda.js");
const products = require("../lambda/products.js");

describe("Lambda Handler - Get Product by ID", () => {
    it("should return a product when given a valid productId", async () => {
      const productId = products[0].id; // Use the first product's ID
      const event = { pathParameters: { productId } }; // Mock event
  
      const response = await handler(event);
  
      expect(response.statusCode).toBe(200);
      expect(response.headers).toEqual({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      });
      expect(JSON.parse(response.body)).toEqual(products[0]); // Ensure the correct product is returned
    });
  
    it("should return 404 if the product does not exist", async () => {
      const event = { pathParameters: { productId: "nonexistent" } }; // Invalid productId
  
      const response = await handler(event);
  
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({ message: "Product not found" });
    });
  
    it("should return 404 if pathParameters is missing", async () => {
      const event = {}; // No pathParameters
  
      const response = await handler(event);
  
      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.body)).toEqual({ message: "Product not found" });
    });
  });