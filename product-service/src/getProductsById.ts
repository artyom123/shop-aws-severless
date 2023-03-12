import { APIGatewayEvent } from 'aws-lambda'
import { DynamoDBService } from './services/dynamoDBService'

import { Product } from './types'

export const getProductsById = async (event: APIGatewayEvent) => {
    try {
        console.log(`getProductsById get: ${event.pathParameters}`)

        const { productId } = event.pathParameters

        const product: Product = await DynamoDBService.getProductById(productId)

        console.log(`getProductsById result: ${product}`)

        if (!product) {
            return {
                statusCode: 404,
                body: 'Product not found'
            }
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify(product)
        }
    } catch (err) {
        return {
            statusCode: 500,
            body:  JSON.stringify( { message: err.message || 'Something went wrong !!!' })
        }
    }
}
