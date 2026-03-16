const jayson = require('jayson');
const client = jayson.client.http({
  port: 8000
});

console.log("--- Smart Home Controller: Sending Commands ---");


const params = ['Living Room', 85]; 


client.request('toggleSmartLight', params, (err, response) => {
  if (err) {
    console.error("Connection Error:", err.message);
    return;
  }

  if (response.error) {
    console.log("RPC Error:", response.error.message);
  } else {
    console.log("Response from House:", response.result);
  }
});