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
  /** The prefix for the magic link that will be part of the auth email */
  callbackUrl: string;
  /** The callback to load the user details if stored outside of Descope */
  verify: VerifyCallback;
  /** Auto refresh the session token if expired */
  autoRefresh?: boolean;
}

interface RequestOptions {
  /** The action we should take */
  action: string;
}

type DescopeSdk = ReturnType<typeof DescopeClient>;
type ValidateSessionRes = ReturnType<DescopeSdk["validateJwt"]>;
type AuthenticationInfo = Awaited<ValidateSessionRes>;

class DescopeStrategy {
  name: string = 'descope';
  _descopeClient: DescopeSdk;

  constructor(private _options: Options) {
    this._descopeClient = DescopeClient({ projectId: _options.projectId, managementKey: _options.managementKey });
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
      return self.fail(message);
    }

    const verifyCallback = (err?: Error | null, user?: Object, info?: any) => {
      if (err) {
        return self.error(err);
      }
      if (!user) {
        return self.fail(info);
      }
      // Retrieve user details if requested
      //  const userDetails = self._descopeClient.management.user.loadByUserId(authInfo.sub);
      return self.success(user, info);
    };

    self._options.verify(authInfo, verifyCallback, req);

    return undefined;
  }
}

export default DescopeStrategy;
