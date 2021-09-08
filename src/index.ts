/* eslint-disable node/no-extraneous-import */
require('dotenv').config();

import * as _ from 'lodash';
import * as httpProxy from 'http-proxy';
import {Request, Response} from 'express';

import {AuthError} from './auth/types';
import authRegistry from './auth/authRegistry';

const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());

const proxy = httpProxy.createProxyServer({});

server.all('*', (req: Request, res: Response) => {
  // Parse basic auth header 'Authorization: Basic [AuthToken]'
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
    // Parse base64 decoded AuthToken as `[substrate/eth/solana].PubKey:SignedMsg`
    const [passedAddress, sig] = _.split(credentials, ':');
    console.log(`Got public address '${passedAddress}' and sigature '${sig}'`);

    // Extract signature type. Default to 'substrate' if not specified
    const gaugedAddress = _.includes(passedAddress, '.')
      ? passedAddress
      : `substrate.${passedAddress}`;
    const [sigType, address] = _.split(gaugedAddress, '.');

    isValid = authRegistry.auth(sigType, {
      address,
      signature: sig,
    });
  } catch (error) {
    console.error(error.message);
    res.writeHead(401, {'Content-Type': 'application/json'});
    res.end(
      JSON.stringify({
        Error: error instanceof AuthError ? error.message : 'Invalid Signature',
      })
    );
    return;
  }

  // You can define here your custom logic to handle the request
  // and then proxy the request.
  if (isValid === true) {
    const target = process.env.IPFS_ENDPOINT || 'http://127.0.0.1:5001';
    console.log(`Validation success. Proxying request to ${target}`);

    proxy.web(req, res, {target}, error => {
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

const port = process.env.PORT || 5050;
console.log(`Listening on port ${port}`);
server.listen(port);
