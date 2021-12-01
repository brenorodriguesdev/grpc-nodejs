const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const path = require('path')

const protoObject = protoLoader.loadSync(path.resolve(__dirname, 'login.proto'))
const loginProto = grpc.loadPackageDefinition(protoObject)

var client = new loginProto.LoginService('localhost:50051', grpc.credentials.createInsecure());
client.auth({ username: 'test', password: '1'}, function (error, response) {
    if (error) {
        console.log(error.details)
        return
    }

    var metadata = new grpc.Metadata();
    metadata.add('authorization', response.token)

    client.hello({}, metadata, function (error, message) {
        if (error) {
            console.log(error.details)
            return
        }
    
        console.log(message)
    });
});
