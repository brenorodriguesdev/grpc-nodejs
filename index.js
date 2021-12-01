const grpc = require('grpc')
const loginProto = grpc.load('login.proto')
const server = new grpc.Server()

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
    }
})

server.bind('127.0.0.1:5051', grpc.ServerCredentials.createInsecure())
server.start()