import {AuthData} from './types';
const fcl = require('@onflow/fcl');

async function auth(data: AuthData): Promise<boolean> {
    console.log('Validate as flow signature');
    const {address, signature} = data;
    const encodeSignature = Buffer.from(signature, 'base64').toString('ascii');
    console.log(`flow address: ${address}, signature: ${encodeSignature}`);
    fcl.config().put('accessNode.api', 'https://flow-access-mainnet.portto.io'); // Configure FCL's Access Node
    const sign = JSON.parse(encodeSignature);
    const MSG = Buffer.from(address).toString('hex');
    const result = await fcl.verifyUserSignatures(MSG, sign);
    console.log(`Flow signature verify result: ${result}`);
    return result;
}

export default {
    auth,
};
