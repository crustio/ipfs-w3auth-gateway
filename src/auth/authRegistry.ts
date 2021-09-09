import {AuthData, AuthError} from './types';
import SubstrateAuth from './substrateAuth';
import EthAuth from './ethAuth';
import SolanaAuth from './solanaAuth';

const _ = require('lodash');

const mapBySigType = (sigTypes: string[], authObject: object) => {
  return _.zipObject(sigTypes, _.fill(Array(_.size(sigTypes)), authObject));
};

const authProviders = {
  ...mapBySigType(['substrate', 'sub', 'cru'], SubstrateAuth),
  ...mapBySigType(['ethereum', 'eth', 'pol'], EthAuth),
  ...mapBySigType(['solana', 'sol'], SolanaAuth),
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
