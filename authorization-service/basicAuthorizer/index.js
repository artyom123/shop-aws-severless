function getToken() {
    const login = process.env.LOGIN
    const password = process.env.PASSWORD

    return Buffer.from(`${login}:${password}`).toString('base64')
}


module.exports.basicAuthorizer = async (event) => {
    if (event.type !== 'REQUEST') {
        throw 'Unauthorized'
    }

    try {
        const [, authorizationToken] = event.headers.Authorization.split(' ')

        const token = getToken()
        const isAuthorized = authorizationToken === token

        return {
            principalId: authorizationToken,
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: isAuthorized ? 'Allow' : 'Deny' ,
                        Resource: event.methodArn
                    }
                ]
            }
        }
    } catch (e) {
        throw `Unauthorized: ${e.message}`
    }
}

