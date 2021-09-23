/* eslint-disable node/no-extraneous-import */
require('dotenv').config();

import * as httpProxy from 'http-proxy';
import {Request, Response} from 'express';

import * as authHandler from '@crustio/auth-handler';

const express = require('express');
const cors = require('cors');

const server = express();
server.use(cors());
server.use(authHandler);

const proxy = httpProxy.createProxyServer({});

server.all('*', (req: Request, res: Response) => {
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
  }
);

const port = process.env.PORT || 5050;
console.log(`Listening on port ${port}`);
server.listen(port);
