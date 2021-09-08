import {AuthData} from './types';
import * as _ from 'lodash';

const EthAccounts = require('web3-eth-accounts');
const ethAccounts = new EthAccounts();

function auth(data: AuthData): boolean {
  const {address, signature} = data;

  console.log('Validate as ethereum signature.');
  const signatureWithPrefix = _.startsWith(signature, '0x')
    ? signature
    : `0x${signature}`;
  const recoveredAddress = ethAccounts.recover(address, signatureWithPrefix);
  console.log(`Recovered ethereum address ${recoveredAddress}`);
  return _.toLower(_.trim(recoveredAddress)) === _.toLower(_.trim(address));
}

export default {
  auth,
};
