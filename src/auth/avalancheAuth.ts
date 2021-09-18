const createHash = require('create-hash');
import {AuthData} from './types';
import BinTools from 'avalanche/dist/utils/bintools';
import {KeyPair} from 'avalanche/dist/apis/avm';
import {getPreferredHRP} from 'avalanche/dist/utils';
import {Buffer} from 'avalanche';
import * as _ from 'lodash';

function addressesEquals(address: string, recoverAddress: string): boolean {
  return _.toLower(_.trim(recoverAddress)) === _.toLower(_.trim(address));
}

/**
 * Signing process https://docs.avax.network/build/references/cryptographic-primitives#signed-messages
 * Learn from https://github.com/ava-labs/avalanche-wallet/blob/ae64a5f25d319314aadf17fa34aefc10528f23cc/src/helpers/helper.ts#L75
 */
function digestMessage(msgStr: string) {
  const mBuf = Buffer.from(msgStr, 'utf8');
  const msgSize = Buffer.alloc(4);
  msgSize.writeUInt32BE(mBuf.length, 0);
  const msgBuf = Buffer.from(
    `\x1AAvalanche Signed Message:\n${msgSize}${msgStr}`,
    'utf8'
  );
  return createHash('sha256').update(msgBuf).digest();
}

/**
 * SolanaAuth expects BS58 public address, and hex signature string
 * Learn from https://github.com/ava-labs/avalanche-wallet/blob/ae64a5f25d319314aadf17fa34aefc10528f23cc/src/components/wallet/advanced/VerifyMessage.vue#L61
 */
function auth(data: AuthData): boolean {
  const bintools: BinTools = BinTools.getInstance();

  console.log('Validate as avalanche signature.');
  const {address, signature} = data;
  const digest = digestMessage(address);
  const digestBuff = Buffer.from(digest.toString('hex'), 'hex');

  const hrp = getPreferredHRP();
  const keypair = new KeyPair(hrp, 'X');
  const signedBuff = bintools.cb58Decode(signature);
  const pubKey = keypair.recover(digestBuff, signedBuff);
  const addressBuff = keypair.addressFromPublicKey(pubKey);
  const recoveredAddress = bintools
    .addressToString(hrp, 'X', addressBuff)
    .substring(2); // Remove the chain id prefix

  return addressesEquals(address, recoveredAddress);
}

export default {
  auth,
};
