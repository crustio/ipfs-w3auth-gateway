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

const chainTypeDelimiter = '-';
const pkSigDelimiter = ':';

server.all('*', (req: Request, res: Response) => {
  // 1. Parse basic auth header 'Authorization: Basic [AuthToken]'
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
    // 2. Decode AuthToken
    const base64Credentials = _.split(
      _.trim(req.headers.authorization),
      ' '
    )[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'ascii'
    );

    // 3. Parse AuthToken as `ChainType[substrate/eth/solana].PubKey:SignedMsg`
    const [passedAddress, sig] = _.split(credentials, pkSigDelimiter);
    console.log(`Got public address '${passedAddress}' and sigature '${sig}'`);

    // 4. Extract chain type, default: 'sub' if not specified
    const gaugedAddress = _.includes(passedAddress, chainTypeDelimiter)
      ? passedAddress
      : `sub${chainTypeDelimiter}${passedAddress}`;
    const [chainType, address] = _.split(gaugedAddress, chainTypeDelimiter);

    isValid = authRegistry.auth(chainType, {
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
