const jayson = require('jayson');
const server = new jayson.Server({
  toggleSmartLight: function(args, callback) {
    const roomName = args[0] || args.roomName;
    const brightness = args[1] || args.brightness;

    const result = `Light in ${roomName} set to ${brightness}%`;
    callback(null, result);
  }
});


server.http().listen(4000, () => {
  console.log("JSON-RPC Smart Home Server running on port 4000");
});