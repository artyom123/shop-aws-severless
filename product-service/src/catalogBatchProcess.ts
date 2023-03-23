import { SQSEvent } from 'aws-lambda'
import { SNS } from 'aws-sdk'

import { DynamoDBService } from './services/dynamoDBService'
import { Product } from './types'

const SNS_TOPIC_ARN = process.env.SNS_TOPIC_ARN;

export const catalogBatchProcess = async (event: SQSEvent) => {
    const sns = new SNS()

    for (const record of event.Records) {
        const productData = typeof record.body === 'string' ? JSON.parse(record.body) : record.body
        const { title, description, count, price } = productData

        try {
            const product = await DynamoDBService.createProduct({
                title,
                description,
                price: Number.parseFloat(price),
                count: Number.parseFloat(count),
            } as Product)

            console.log(`Product ${product.id}: Added`);
        } catch (err) {
            console.log(`Error on add: ${err}`);
        }
    }

    sns.publish({
            Subject: 'Products uploaded',
            Message: 'New products uploaded',
            TopicArn: SNS_TOPIC_ARN
        },
        () => {
            console.log('Email send');
        }
    )
}

