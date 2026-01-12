import type { Cookies } from '@sveltejs/kit';
import { jwtVerify, importSPKI } from 'jose';
import { KC_PUBLIC_KEY } from '$env/static/private';

export type ATPayload = {
  exp: number;
  iat: number;
  auth_time: number;
  jti: string;
  iss: string;
  aud: string;
  sub: string;
  typ: string;
  azp: string;
  nonce: string;
  session_state: string;
  acr: string;
  'allowed-origins': string[];
  realm_access: {
    roles: string[];
  };
  resource_access: {
    account: {
      roles: any[];
    };
  };
  scope: string;
  sid: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
};

const pubKeyPEM = `
-----BEGIN PUBLIC KEY-----
${KC_PUBLIC_KEY}
-----END PUBLIC KEY-----
`;

export async function authenticate(cookies: Cookies) {
  const token = cookies.get('accessToken');
  if (!token) return undefined;

  try {
    console.log(JSON.stringify({ pubKeyPEM }));
    const ecPublicKey = await importSPKI(pubKeyPEM.trim(), 'RS256');
    const { payload } = await jwtVerify(token, ecPublicKey, {
      algorithms: ['RS256']
    });

    return payload as unknown as ATPayload;
  } catch (e) {
    console.error('JWT Verification failed:', e);
    return undefined;
  }
}
