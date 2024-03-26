import type { LayoutServerLoad } from './$types';
import jwt from 'jsonwebtoken';

const pubKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq/dcIbhN35r3fpD5pid1Z/CM6n4RhwnDREJ/QCewSYiXtgik8GiM90BQtBBu7dRZuKwhaIDbEsf5yDouWEri1kM1AjE7WO9KJ2ZxvO3wro1biIuFMrafRtd0ZISsOc/mchbIAI5f2i/2B7sJbl3oTRkUHvh47GhtaHtRlh7NkWt4H5QktTem/jiPreTl/2wvYOuvBruScKDsQVbMUSXrxI4gkdJ+DTe/AJ740VO+H4VFOS4ohdBaEE83ExgiB/Mk9GaOVz6ZTMsnrHwwgXW9tl/0LwkvOA1BNVVYF3s2srXaeOrwxOQtkxY8mIQ1T/YaRFovFjafg0UVk9H8PKFkWQIDAQAB
-----END PUBLIC KEY-----
`;

export type Auth = {
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

export const load: LayoutServerLoad = async ({ cookies }) => {
	let auth: Auth | undefined;
	try {
		auth = jwt.verify(cookies.get('accessToken')!, pubKey, {
			algorithms: ['RS256']
		}) as Auth;
		console.log(auth);
	} catch (e) {
		console.error(e);
	}
	return {
		auth
	};
};
