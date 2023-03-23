import { APIGatewayProxyEvent } from 'aws-lambda'
import { getProductsById } from '../getProductsById'

describe('getProductsById', () => {
    test('should return product by id', async () => {
        const eventMocked = {
            body: '',
            headers: {},
            httpMethod: 'get',
            pathParameters: {id: "7567ec4b-b10c-48c5-9345-fc73348a80a1"}
        } as unknown as APIGatewayProxyEvent
        const response = await getProductsById(eventMocked)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            count: 5,
            description: "Product 4",
            id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
            price: 15,
            title: "Wallpaper for baby"
        })
    })

    test('should return 404 when a product not found', async () => {
        const eventMocked = {
            body: '',
            headers: {},
            httpMethod: 'get',
            pathParameters: { id: '1' }
        } as unknown as APIGatewayProxyEvent
        const response = await getProductsById(eventMocked)

        expect(response.statusCode).toBe(404)
    });
});
