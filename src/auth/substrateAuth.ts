/* eslint-disable node/no-extraneous-import */
import {AuthData} from './types';
import {decodeAddress, signatureVerify} from '@polkadot/util-crypto';
import {u8aToHex} from '@polkadot/util';

function auth(data: AuthData): boolean {
  const {address, signature} = data;

  try {
    console.log('Validate as substrate signature.');
    const publicKey = decodeAddress(address);
    const hexPublicKey = u8aToHex(publicKey);
    return signatureVerify(address, signature, hexPublicKey).isValid;
  } catch (error) {
    console.error(error.message);
  }

  return false;
}

export default {
  auth,
};
