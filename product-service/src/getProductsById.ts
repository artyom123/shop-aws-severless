import { APIGatewayEvent } from 'aws-lambda'
import { Product } from './types'

export const getProductsById = async (event: APIGatewayEvent) => {
    const productsDataMocked: Product[] = require('./data/products.mocked.json')
    const { productId } = event.pathParameters

    const product = await productsDataMocked.find((product) => product.id === productId)

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
    };
}
