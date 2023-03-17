import { APIGatewayEvent } from 'aws-lambda'
import { DynamoDBService } from './services/dynamoDBService'

import { Product } from './types'

export const getProductsList = async (event: APIGatewayEvent) => {
    try {
        console.log(`getProductsList start: ${event}`)

        const products: Product[] = await DynamoDBService.getProductsList()

        console.log(`getProductsList result: ${products}`)

        if (!products.length) {
            return {
                statusCode: 404,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Credentials': true
                },
                body: 'No found products'
            }
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify(products)
        }
    } catch (err) {
        return {
            statusCode: 500,
            body:  JSON.stringify( { message: err.message || 'Something went wrong !!!' })
        }
    }
}
