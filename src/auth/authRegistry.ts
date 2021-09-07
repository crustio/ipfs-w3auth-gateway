import {AuthData, AuthError} from './types';
import PolkadotAuth from './polkadotAuth';
import EthAuth from './ethAuth';

const _ = require('lodash');

const mapBySigType = (sigTypes: string[], authObject: object) => {
  return _.zipObject(sigTypes, _.fill(Array(_.size(sigTypes)), authObject));
};

const authProviders = {
  ...mapBySigType(['polkadot', 'polka', 'substrate', 'crust'], PolkadotAuth),
  ...mapBySigType(['ethereum', 'eth'], EthAuth),
};

function auth(signatureType: string, data: AuthData): boolean {
  const authProvider = _.get(
    authProviders,
    _.toLower(_.trim(signatureType)),
    null
  );
  if (_.isEmpty(authProvider)) {
    throw new AuthError('Unsupported web3 signature');
  }
  return authProvider.auth(data);
}

export default {
  auth,
};
