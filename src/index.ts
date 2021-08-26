/* eslint-disable node/no-extraneous-import */
require('dotenv').config();

import * as http from 'http';
import * as httpProxy from 'http-proxy';

import {decodeAddress, signatureVerify} from '@polkadot/util-crypto';
import {u8aToHex} from '@polkadot/util';
import * as _ from 'lodash';

const proxy = httpProxy.createProxyServer({});

const server = http.createServer((req: any, res: any) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        Success: true,
      })
    );
    return;
  }

  // 1. Parse auth header as [pubKey, sig]
  if (!_.includes(req.headers.authorization, 'Basic ')) {
    res.writeHead(401, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        Error: 'Empty Signature',
      })
    );
    return;
  }

  let isValid = false;
  try {
    const base64Credentials = _.split(
      _.trim(req.headers.authorization),
      ' '
    )[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii'
    );
    const [address, sig] = credentials.split(':');
    console.log(`Got public address '${address}' and sigature '${sig}'`);

    // 2. Validate with substrate
    // TODO: More web3 validating methods, like ethereum, solana, filecoin, ...
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);
    isValid = signatureVerify(address, sig, hexPublicKey).isValid;
  } catch (error) {
    console.error(error.message);
    res.writeHead(401, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        Error: 'Invalid Signature',
      })
    );
    return;
  }

  // You can define here your custom logic to handle the request
  // and then proxy the request.
  if (isValid === true) {
    const target = process.env.IPFS_ENDPOINT || 'http://127.0.0.1:5001';
    console.log(`Validation success. Proxying request to ${target}`);

    proxy.web(req, res, {target}, (error: any) => {
      console.error(error);
      res.writeHead(500, {'Content-Type': 'application/json'});
      res.end(
        JSON.stringify({
          Error: error.message,
        })
      );
    });
  } else {
    console.error('Validation failed');
    res.writeHead(401, {'Content-Type': 'application/json'});

    res.end(
      JSON.stringify({
        Error: 'Invalid Signature',
      })
    );
  }
});

console.log(`Listening on port ${process.env.PORT}`);
server.listen(process.env.PORT || 5050);
