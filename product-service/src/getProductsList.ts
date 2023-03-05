import { APIGatewayEvent } from 'aws-lambda'
import { Product } from './types'

export const getProductsList = async (event: APIGatewayEvent) => {
    const productsDataMocked: Product[] = require('./data/products.mocked.json')
    const products = JSON.stringify(productsDataMocked)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        },
        body: products
    }
}
