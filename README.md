# IPFS Web3 Authenticator &middot; [![GitHub license](https://img.shields.io/github/license/crustio/crust?logo=apache)](LICENSE)

A web3 authentication service on IPFS gateway.

## Deployment

### 1. IPFS Gateway

Deploy and run a plain IPFS gateway. By default, [IPFS HTTP API](https://docs.ipfs.io/reference/http/api) is exposed at port 5001. 

### 2. IPFS WEB3 Authenticator

#### Create and Configure .env

*.env* file can be created by copying *[.env-example](https://github.com/crustio/ipfs-web3-authenticator/blob/main/.env-example)* file. Below is the list of environment variables that could be configured in *.env*:

- **PORT**: Local port that this IPFS Web3 Authenticator service will listen for incoming requests

- **PROXY_TARGET**: API endpoint that client requests will be fordwarded to after authentication. This should be the API endpoint that is exposed by an IPFS Gateway.

#### Build and Start Service

```sh
$ yarn && yarn build && yarn start
```

### 3. Candy

[Caddy](https://caddyserver.com) is recommended to be used together with IPFS Web3 Authenticator.

As an example, if your IPFS Web3 Authenticator service is deployed on the same machine with your Caddy server, listening on 5050 port, and you want it to be accessed at *https://ipfs-auth.example.com*, the simplest [Caddyfile](https://caddyserver.com/docs/quick-starts/caddyfile) could be like:

```yml
https://ipfs-auth.example.com {
  reverse_proxy 127.0.0.1:5050
}
```

## Usage

Client can now call [IPFS HTTP API](https://docs.ipfs.io/reference/http/api) as usual, only that a signature generated via a Web3 wallet need be included as [HTTP access authentication](https://en.wikipedia.org/wiki/Basic_access_authentication) credentials.

### Sample Request

```sh
curl --request POST 'https://ipfs-auth.example.com/api/v0/add' \
 --header 'Authorization: Basic <CREDENTIALS>' \
 --form 'path=@"<FILE_PATH>"'
```

### Credential Generation

Authentication credentials can be generated using Polkadot and essentially all substrate-based (like Crust, of course) Web3 wallets.  

Usually credentials are generated *programmatically* as part of client applications, but as an illustration, here are *manual* steps to generate credentials using Polkadot Apps:

1. Open [Polkadot Apps Portal](https://polkadot.js.org/apps), add an account by pressing *'+ Add account'*. Or, if you are using [Polkadot Extension](https://polkadot.js.org/extension), an account will be auto-injected to the Apps Portal.

2. Go to '*Developer* -> *Sign and verify*', select an account, and sign the account's *public address* to create the *signature*.

3. Construct a string with account public address and the generated signature in format of `<ACCOUNT_PUBLIC_ADDRESS>:<SIGNATURE>`, and base64 encode it. Congratulations! Now you get the credentials to authenticate with the IPFS Web3 Authenticator.

## Building

### Install dependencies
```sh
$ yarn
```

### Run in dev mode
```sh
$ yarn dev
```

### Build and run in prod mode
```sh
$ yarn build
$ yarn start
```

## License

[Apache 2.0](https://github.com/crustio/ipfs-web3-authenticator/blob/main/LICENSE)
