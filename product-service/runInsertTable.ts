import AWS from 'aws-sdk'
import {v4 as uuidv4} from 'uuid'
import fs from 'fs'

import { Product } from './src/types'

AWS.config.update({ region: 'eu-west-1' })

const dynamoClient = new AWS.DynamoDB.DocumentClient()
const productsDataMocked: Product[] = JSON.parse(fs.readFileSync('./src/data/products.mocked.json', 'utf8'))

productsDataMocked.forEach(({ title, description, price, count}) => {
    const id = uuidv4()

    const product = {
        TableName: process.env.DYNAMODB_PRODUCTS_TABLE,
        Item: {
            id: id,
            title: title,
            description: description,
            price:  price,
        }
    }
    const stock = {
        TableName: process.env.DYNAMODB_STOCK_TABLE,
        Item: {
            product_id: id,
            count: count,
        }
    }

    dynamoClient.put(product, (err, data) => {
        if (err) {
            console.error(`Error: ${JSON.stringify(err)}`)
        } else {
            console.log(`Success: ${JSON.stringify(data)}`)
        }
    })

    dynamoClient.put(stock, function(err, data) {
        if (err) {
            console.error(`Error: ${JSON.stringify(err)}`)
        } else {
            console.log(`Success: ${JSON.stringify(data)}`)
        }
    })
})
