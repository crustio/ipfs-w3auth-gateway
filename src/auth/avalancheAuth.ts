const createHash = require('create-hash');
import {AuthData} from './types';
import BinTools from 'avalanche/dist/utils/bintools'
import { KeyPair } from 'avalanche/dist/apis/avm'
import { getPreferredHRP } from 'avalanche/dist/utils'
import { Buffer } from 'avalanche'
import * as _ from 'lodash';

function addressesEquals(address: string, recoverAddress: string): boolean {
  return _.toLower(_.trim(recoverAddress)) === _.toLower(_.trim(address));
}

/**
 * Signing process https://docs.avax.network/build/references/cryptographic-primitives#signed-messages
 * Learn from https://github.com/ava-labs/avalanche-wallet/blob/ae64a5f25d319314aadf17fa34aefc10528f23cc/src/helpers/helper.ts#L75
 */
function digestMessage(msgStr: string) {
  let mBuf = Buffer.from(msgStr, 'utf8');
  let msgSize = Buffer.alloc(4);
  msgSize.writeUInt32BE(mBuf.length, 0);
  let msgBuf = Buffer.from(`\x1AAvalanche Signed Message:\n${msgSize}${msgStr}`, 'utf8');
  return createHash('sha256').update(msgBuf).digest();
}

/**
 * SolanaAuth expects BS58 public address, and hex signature string
 * Learn from https://github.com/ava-labs/avalanche-wallet/blob/ae64a5f25d319314aadf17fa34aefc10528f23cc/src/components/wallet/advanced/VerifyMessage.vue#L61
 */
function auth(data: AuthData): boolean {
  let bintools: BinTools = BinTools.getInstance();

  console.log('Validate as avalanche signature.');
  const {address, signature} = data;
  let digest = digestMessage(address);
  let digestBuff = Buffer.from(digest.toString('hex'), 'hex');

  let hrp = getPreferredHRP();
  let keypair = new KeyPair(hrp, 'X');
  let signedBuff = bintools.cb58Decode(signature);
  let pubKey = keypair.recover(digestBuff, signedBuff);
  let addressBuff = keypair.addressFromPublicKey(pubKey);
  const recoveredAddress = bintools.addressToString(hrp, 'X', addressBuff).substring(2); // Remove the chain id prefix

  return addressesEquals(address, recoveredAddress);
}

export default {
  auth,
};
