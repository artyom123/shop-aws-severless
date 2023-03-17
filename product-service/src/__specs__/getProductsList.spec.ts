import {describe, expect, test} from '@jest/globals'
import { APIGatewayProxyEvent } from 'aws-lambda'
import { getProductsList } from '../getProductsList'

const eventMocked = {
    body: '',
    headers: {},
    httpMethod: 'get'
} as APIGatewayProxyEvent

describe('getProductsList', () => {
    test('should return products', async () => {
        const response = await getProductsList(eventMocked)

        expect(response.statusCode).toBe(200)
    });
});
