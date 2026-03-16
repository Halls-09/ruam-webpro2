const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('crypto.proto');
const cryptoProto = grpc.loadPackageDefinition(packageDefinition);

function streamPrices(call) {

  const intervalId = setInterval(() => {
    const randomPrice = (Math.random() * 5000 + 90000).toFixed(2);
    call.write({ value: parseFloat(randomPrice) });
  }, 500);

  call.on('end', () => clearInterval(intervalId));
}

const server = new grpc.Server();
server.addService(cryptoProto.CryptoService.service, { StreamPrices: streamPrices });


server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
  console.log('gRPC Server is running on port 50051');
});