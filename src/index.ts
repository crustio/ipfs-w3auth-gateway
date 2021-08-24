require('dotenv').config();

const http = require('http');
const httpProxy = require('http-proxy');

const { decodeAddress, signatureVerify } = require('@polkadot/util-crypto');
const { u8aToHex } = require('@polkadot/util');

//
// Create a proxy server with custom application logic
//
const proxy = httpProxy.createProxyServer({});

//
// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
//
const server = http.createServer(function(req: any, res: any) {
  // 1. Parse auth header as [pubKey, sig]
  const authHeader = req.headers.authorization;
  const authInfo = authHeader.substring("Basic ".length).trim();
  
  const buff = Buffer.from(authInfo, 'base64');
  const unpw = buff.toString('ascii').split(':');
  
  const address = unpw[0];
  const sig = unpw[1];
  console.log(`Got pk(${address}) sig(${sig})`);

  // 2. Validate with substrate
  // TODO: More web3 validating methods, like ethereum, solana, filecoin, ...
  const publicKey = decodeAddress(address);
  const hexPublicKey = u8aToHex(publicKey);
  const isValid = signatureVerify(address, sig, hexPublicKey).isValid;
  
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  if (isValid === true) {
    console.log('Validation success');
    proxy.web(req, res, { target: process.env.PROXY_TARGET || 'http://127.0.0.1:5001' });
  } else {
    console.error('Validation failed');
    res.end();
  }
});

console.log("Listening on port 5050")
server.listen(5050);
