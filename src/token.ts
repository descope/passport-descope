/* eslint-disable no-console */
import { Request } from 'express';
import DescopeClient from '@descope/node-sdk';

export const tokenFromCookie = (request: Request) => {
  const list: { [key: string]: string } = {};
  const cookieHeader = request.headers?.cookie;
  if (!cookieHeader) return null;

  cookieHeader.split(`;`).forEach((cookie: string) => {
    let [name, ...rest] = cookie.split(`=`);
    name = name?.trim();
    if (!name) return;
    const value = rest.join(`=`).trim();
    if (!value) return;
    list[name] = decodeURIComponent(value);
  });

  return list[DescopeClient.SessionTokenCookieName];
};

export const tokenFromHeader = (request: Request) => {
  const authHeader = request.headers?.authorization;
  if (!authHeader) return null;

  const parts = authHeader.split(' ');
  if (parts.length == 2) {
    const scheme = parts[0], credentials = parts[1];
    if (/^Bearer$/i.test(scheme)) {
      return credentials;
    }
  }
  return null
};