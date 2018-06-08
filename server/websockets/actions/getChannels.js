module.exports = (wss, ws) => {
  var channelsList = Object.keys(wss.channels);
  console.log(channelsList);
}