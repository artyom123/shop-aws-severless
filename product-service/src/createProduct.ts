import { APIGatewayEvent } from 'aws-lambda'
import { DynamoDBService } from './services/dynamoDBService'
import { ValidationService } from './services/validationService'

export const createProduct = async (event: APIGatewayEvent) => {
    try {
        console.log(`createProduct get: ${event.body}`)

        const productData = JSON.parse(event.body)
        const errors = ValidationService.validate(productData)

        if (errors.length) {
            return {
                statusCode: 400,
                body: JSON.stringify(errors)
            }
        }

        const product = await DynamoDBService.createProduct(productData)

        console.log(`createProduct result: ${product}`)

        return {
            statusCode: 200,
            body: JSON.stringify(product)
        }
    } catch (err) {
        return {
            statusCode: 500,
            body:  JSON.stringify( { message: err.message || 'Something went wrong !!!' })
        }
    }
}
