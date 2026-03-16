const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const packageDefinition = protoLoader.loadSync('crypto.proto');
const cryptoProto = grpc.loadPackageDefinition(packageDefinition).CryptoService;

const client = new cryptoProto('localhost:50051', grpc.credentials.createInsecure());


const call = client.StreamPrices({});

call.on('data', (data) => {

  console.log(`Current BTC Price: $${data.value}`);
});