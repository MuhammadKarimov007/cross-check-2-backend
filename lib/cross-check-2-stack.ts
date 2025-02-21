import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";

export class CrossCheck2Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const productListFunction = new lambda.Function(this, "ProductListFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "getProductListLambda.handler",
    });
    
    const productByIdFunction = new lambda.Function(this, "ProductByIdFunction", {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset("lambda"),
      handler: "getProductByIdLambda.handler",
    });
    
    const api = new apigateway.RestApi(this, "ProductServiceAPI");
    
    const getProducts = api.root.addResource("products");
    getProducts.addMethod("GET", new apigateway.LambdaIntegration(productListFunction));

    const productById = getProducts.addResource("{productId}");
    productById.addMethod("GET", new apigateway.LambdaIntegration(productByIdFunction));
  }
}