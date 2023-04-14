/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { Request, Response } from 'express';
import { StrategyCreatedStatic } from 'passport';
import { tokenFromHeader, tokenFromCookie } from './token';
import DescopeClient from '@descope/node-sdk';

type VerifyCallback = (
  payload: any,
  verifyCallback: (err?: Error | null, user?: Object, info?: any) => void,
  req: Request,
) => void;

interface Options {
  /** Descope project id to use */
  projectId: string;
  /** Descope optional management key to retrieve extra user details */
  managementKey?: string;
  /** The callback to load the user details if stored outside of Descope */
  verify: VerifyCallback;
  /** The realm for the challenge */
  realm?: string;
  /** The scopes for the challenge */
  scope?: [string] | string;
}

type DescopeSdk = ReturnType<typeof DescopeClient>;
type ValidateSessionRes = ReturnType<DescopeSdk["validateJwt"]>;
type AuthenticationInfo = Awaited<ValidateSessionRes>;

/**
 * DescopeStrategy for PassportJS verifies that the given JWT token in either Authorization Bearer or DS cookie is valid.
 * It requires the Descope project ID and a verify function is there to allow the app to manipulate user details.
 */
class DescopeStrategy {
  name: string = 'descope';
  _descopeClient: DescopeSdk;
  _realm: string;
  _scope: [string];

  constructor(private _options: Options) {
    this._descopeClient = DescopeClient({ projectId: _options.projectId, managementKey: _options.managementKey });
    this._realm = _options.realm || 'Users';
    if (_options.scope) {
      this._scope = (Array.isArray(_options.scope)) ? _options.scope : [ _options.scope ];
    }
  }

  async authenticate(this: StrategyCreatedStatic & DescopeStrategy, req: Request, options?: any): Promise<void> {
    const self = this;
    const token = tokenFromHeader(req) || tokenFromCookie(req);
    let authInfo: AuthenticationInfo = null;
    try {
      authInfo = await self._descopeClient.validateJwt(token);
    } catch (error) {
      const defaultMessage = 'No valid token provided';
      const message = error instanceof Error ? error.message : defaultMessage;
      return self.fail(self._challenge(401, message));
    }

    const verifyCallback = (err?: Error | null, user?: Object, info?: any) => {
      if (err) {
        return self.error(err);
      }
      if (!user) {
        if (typeof info == 'string') {
          info = { message: info }
        }
        info = info || {};
        return self.fail(self._challenge(401, 'invalid_token', info.message));  
      }
      // Retrieve user details if requested
      //  const userDetails = self._descopeClient.management.user.loadByUserId(authInfo.sub);
      return self.success(user, info);
    };

    self._options.verify(authInfo, verifyCallback, req);
  }

  /**
   * Generate a challenge response in case of failure
   * @param this the Descope strategy
   * @param code error code
   * @param desc error description
   * @param uri relevant uri for the error
   * @returns the challenge string
   */
  _challenge(this: StrategyCreatedStatic & DescopeStrategy, code?: number, desc?: string, uri?: string) {
    let challenge = 'Bearer realm="' + this._realm + '"';
    if (this._scope) {
      challenge += ', scope="' + this._scope.join(' ') + '"';
    }
    if (code) {
      challenge += ', error="' + code + '"';
    }
    if (desc) {
      challenge += ', error_description="' + desc + '"';
    }
    if (uri) {
      challenge += ', error_uri="' + uri + '"';
    }
    return challenge;
  }
}

export default DescopeStrategy;
