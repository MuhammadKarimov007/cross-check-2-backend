# CrossCheck 2 - AWS Lambda & API Gateway

## Overview

This project implements AWS Lambda functions and API Gateway endpoints for managing product data. It includes:

- A Lambda function to fetch all product items.
- A Lambda function to fetch a single product item by `productId`.
- API Gateway endpoints to expose these Lambda functions.
- A web frontend to display the product list.
- API integration with S3 buckets

## API Endpoints

### Get All Products

**Endpoint:**

```
GET https://pqtydk14z5.execute-api.ap-southeast-1.amazonaws.com/prod/products
```

**Response:**

```json
[
  { "id": "1", "name": "Product 1", "price": 10 },
  { "id": "2", "name": "Product 2", "price": 20 },
  { "id": "3", "name": "Product 3", "price": 30 }
]
```

### Get Product by ID

**Endpoint:**

```
GET https://pqtydk14z5.execute-api.ap-southeast-1.amazonaws.com/prod/products/{productId}
```

Replace `{productId}` with a valid ID (1-3).

**Response (Success):**

```json
{
  "id": "1", "name": "Product 1", "price": 10
}
```

**Response (Not Found):**

```json
{
  "message": "Product not found"
}
```

## AWS CDK Setup

This project uses AWS Cloud Development Kit (CDK) to deploy resources.

## Frontend (FP Page)

A webpage was created to display product items using the Lambda function.

- **Live Site:** [View Here](https://d2vm25kpc0q132.cloudfront.net/)

## S3-Hosted Webpage

An additional webpage is hosted on S3 for viewing product items.

- **Live Site:** [View Here](https://product-list-viewer-webpage-shk13420.s3.ap-southeast-1.amazonaws.com/index.html)

## Running Tests

Unit tests ensure Lambda handlers function correctly. Run tests with:

```sh
npm test
```

## Deployment

To deploy the AWS CDK stack:

```sh
cdk deploy
```
