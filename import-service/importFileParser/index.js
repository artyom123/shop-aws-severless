const AWS = require('aws-sdk')
const csv = require('csv-parser')

module.exports.importFileParser = async (event) => {
    const s3 = new AWS.S3({ region: process.env.REGION })
    const result = []

    try {
        for (const record of event.Records) {
            const paramsFile = {
                Bucket: record.s3.bucket.name,
                Key: record.s3.object.key,
            }
            const paramsCopyFile = {
                Bucket: record.s3.bucket.name,
                CopySource: `${record.s3.bucket.name}/${record.s3.object.key}`,
                Key: 'parsed',
            }

            const s3Stream = s3.getObject(paramsFile).createReadStream()

            await new Promise((res, rej) => {
                s3Stream.pipe(csv())
                    .on('data', data => {
                        result.push(data)
                        console.log(`Parsing: ${result}`)
                    })
                    .on('end', async () => {
                        console.log('Parsing finished')

                        console.log('Copying started')
                        await s3.copyObject(paramsCopyFile).promise()
                        console.log('Copying finished')

                        console.log('Deleting started')
                        await s3.deleteObject(paramsFile).promise()
                        console.log('Deleting finished')
                        res()
                    })
                    .on('error', (err) => {
                        console.log(`Event "error": ${err}`)
                        rej()
                    })
            })
        }

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify("Success copied"),
        }
    } catch (err) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify("Error copied"),
        }
    }
}
