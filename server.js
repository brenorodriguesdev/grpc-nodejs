const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')
const server = new grpc.Server()


const protoObject = protoLoader.loadSync(path.resolve(__dirname, 'login.proto'))
const loginProto = grpc.loadPackageDefinition(protoObject)


function auth(authModel) {
    const { username, password } = authModel

    if (!username) {
        throw new Error('username is required')        
    }

    if (!password) {
        throw new Error('password is required')
    }

    return { token: 'any_token' }
}

server.addService(loginProto.LoginService.service, {
    auth: (call, callback) => {
        try {
            callback(null, auth(call.request))
        } catch (error) {
            callback(error, null)
        }
    },
    hello: (call, callback) => {
        try {

            
            const authorization = call.metadata.get("authorization"); 

            if (!authorization)  {
                throw new Error('token is required')
            }

            if (authorization != 'any_token')  {
                throw new Error('token is invalid')
            }

            callback(null,  { message: 'hello' })
        } catch (error) {
            callback(error, null)
        }
    }
})

server.bind('127.0.0.1:50051', grpc.ServerCredentials.createInsecure())
server.start()