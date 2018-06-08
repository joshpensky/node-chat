const WebSocket = require('ws');
const uuid = require('node-uuid');

WebSocket.Server.prototype.createChannel = function(channelName) {
  this.channels = this.channels || {};
  if (channelName in this.channels) {
    console.log('channel already exists!');
    return false;
  } else {
    this.channels[channelName] = {
      id: uuid.v4(),
      name: channelName,
      clients: new Set(),
      history: [],
    };
    console.log('new channel created: ' + channelName)
    return true;
  }
}

WebSocket.Server.prototype.joinChannel = function(client, channelName) {
  if (this.channels && this.channels[channelName]) {
    var channel = this.channels[channelName];
    const clientLength = channel.clients.size;
    channel.clients.add(client);
    if (clientLength === channel.clients.size) {
      console.log(client.id + ' already in channel ' + channelName)
      return false;
    }
    client.channels = client.channels || new Set();
    client.channels.add(channelName);
    console.log(client.id + ' joined ' + channelName)
    return true;
  }
  console.log('The channel \"' + channelName + '\" does not exist.');
}