const AWS = require('aws-sdk')


module.exports.importProductsFile = async (event) => {
    const { name } = event.queryStringParameters
    const s3 = new AWS.S3({ region: process.env.REGION, signatureVersion: 'v4' })
    const params = {
        Bucket: process.env.IMPORT_BUCKET,
        Key: `uploaded/${name.trim()}`,
        Expires: 300,
        ContentType: 'text/csv',
    }

    const signedUrl = await s3.getSignedUrlPromise('putObject', params)

    console.log(`URL: ${signedUrl}`)

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(signedUrl),
    }
}
