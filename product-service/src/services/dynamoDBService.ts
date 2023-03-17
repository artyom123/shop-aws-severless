import {DynamoDB} from 'aws-sdk'
import {v4 as uuidv4} from 'uuid'

import {Product} from '../types'

export class DynamoDBService {
    private static DYNAMO_DB = new DynamoDB.DocumentClient()
    private static PRODUCTS_TABLE = process.env.DYNAMODB_PRODUCTS_TABLE
    private static STOCK_TABLE = process.env.DYNAMODB_STOCK_TABLE

    private static unmarshallList(items) {
        const unmarshalledItems = []

        for (let index = 0; index < items.length; index++) {
            const item = items[index]
            unmarshalledItems.push(item)
        }

        return unmarshalledItems
    }

    private static async scan(tableName: string) {
        const result = await this.DYNAMO_DB.scan({
            TableName: tableName,
        }).promise()

        return this.unmarshallList(result.Items)
    }

    private static async put(tableName: string, item: any) {
        await this.DYNAMO_DB.put({
            TableName: tableName,
            Item: item,
        }).promise()

        return item
    }

    static getProductsList = async () => {
        const products = await this.scan(this.PRODUCTS_TABLE)

        if (!products.length) {
            return []
        }

        const stock = await this.scan(this.STOCK_TABLE)

        return products.map(product => {
            const { count } = stock.find(item => item.product_id === product.id)

            return { ...product, count  }
        })
    }

    static getProductById = async (id: string) => {
        const products = await this.getProductsList()

        return products.find(product => product.id === id)
    }

    static createProduct = async (data: Product) => {
        const uuid = uuidv4()
        const product = await this.put(this.PRODUCTS_TABLE, {
            id: uuid,
            description: data.description || '',
            title: data.title,
            price: data.price,
        })
        const stock = await this.put(this.STOCK_TABLE, {
            product_id: uuid,
            count: data.count,
        })

        return { ...product, count: stock.count }
    }

    static createProductTransaction = async (data) => {
        const uuid = uuidv4()
        const params = {
            TransactItems: [
                {
                    Put: {
                        TableName: this.PRODUCTS_TABLE,
                        Item: {
                            id: uuid,
                            description: data.description || '',
                            title: data.title,
                            price: data.price,
                        },
                    },
                },
                {
                    Put: {
                        TableName: this.STOCK_TABLE,
                        Item: {
                            product_id: uuid,
                            count: data.count,
                        },
                    },
                },
            ]
        }

        return this.DYNAMO_DB.transactWrite(params).promise()
    }
}
