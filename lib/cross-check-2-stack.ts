import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class CrossCheck2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productTable = dynamodb.Table.fromTableName(this, "ExistingProductsTable", "products");
    const stockTable = dynamodb.Table.fromTableName(this, "ExistingStockTable", "stocks");

    const productListFunction = new lambda.Function(this, "ProductListFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "getProductListLambda.handler",
      environment: {
        PRODUCTS_TABLE_NAME: productTable.tableName,
        STOCKS_TABLE_NAME: stockTable.tableName,
        REGION: this.region,
      },
    });

    const productByIdFunction = new lambda.Function(this, "ProductByIdFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "getProductByIdLambda.handler",
      environment: {
        PRODUCTS_TABLE_NAME: productTable.tableName,
        STOCKS_TABLE_NAME: stockTable.tableName,
        REGION: this.region,
      },
    });

    const createProductLambda = new lambda.Function(this, "CreateProductLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "createProductLambda.handler",
      environment: {
        PRODUCTS_TABLE_NAME: productTable.tableName,
        STOCKS_TABLE_NAME: stockTable.tableName,
      },
    });

    productTable.grantReadData(productListFunction);
    productTable.grantReadData(productByIdFunction);
    stockTable.grantReadData(productListFunction);
    stockTable.grantReadData(productByIdFunction);

    productTable.grantWriteData(createProductLambda);
    stockTable.grantWriteData(createProductLambda);

    const api = new apigateway.RestApi(this, "ProductServiceAPI");

    const getProducts = api.root.addResource("products");
    getProducts.addMethod("GET", new apigateway.LambdaIntegration(productListFunction));
    getProducts.addMethod("POST", new apigateway.LambdaIntegration(createProductLambda)); // Use existing resource

    const productById = getProducts.addResource("{productId}");
    productById.addMethod("GET", new apigateway.LambdaIntegration(productByIdFunction));
  }
}