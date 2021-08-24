require('dotenv').config();

const _ = require('lodash');

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
  if (!_.includes(req.headers.authorization, 'Basic ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Empty Signature'
    }));
    return;
  }

  let isValid = false;
  try {
    const base64Credentials = _.split(_.trim(req.headers.authorization), ' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [address, sig] = credentials.split(':');
    console.log(`Got public address '${address}' and sigature '${sig}'`);

    // 2. Validate with substrate
    // TODO: More web3 validating methods, like ethereum, solana, filecoin, ...
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);
    isValid = signatureVerify(address, sig, hexPublicKey).isValid;
  }
  catch (error) {
    console.error(error.message);
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Invalid Signature'
    }));
    return;
  }
  
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  if (isValid === true) {
    console.log('Validation success');
    proxy.web(req, res, { target: process.env.PROXY_TARGET || 'http://127.0.0.1:5001' });
  }
  else {
    console.error('Validation failed');
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: 'Invalid Signature'
    }));
    return;
  }
});

console.log("Listening on port 5050")
server.listen(5050);
