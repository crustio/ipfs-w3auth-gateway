import {AuthData} from './types';
import {ethers} from 'ethers';
import * as _ from 'lodash';

function addressesEquals(address: string, recoverAddress: string): boolean {
  return _.toLower(_.trim(recoverAddress)) === _.toLower(_.trim(address));
}

function auth(data: AuthData): boolean {
  const {address, signature} = data;

  console.log('Validate as ethereum signature.');
  const signatureWithPrefix = _.startsWith(_.toLower(signature), '0x')
    ? signature
    : `0x${signature}`;

  // For some signing tools like mycrypto, we can directly verify the signature
  let recoveredAddress = ethers.utils.verifyMessage(
    address,
    signatureWithPrefix
  );
  if (addressesEquals(address, recoveredAddress)) {
    return true;
  }
  // Some some signing tools like myetherwallet, we need hash the message before recover
  const hashBytes = ethers.utils.arrayify(address);
  const messageHash = ethers.utils.hashMessage(hashBytes);
  recoveredAddress = ethers.utils.recoverAddress(
    messageHash,
    signatureWithPrefix
  );
  return addressesEquals(address, recoveredAddress);
}

export default {
  auth,
};
