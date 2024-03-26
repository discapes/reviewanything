import { PUBLIC_KC_URL } from '$env/static/public';
import type { LayoutServerLoad } from './$types';
import jwt from 'jsonwebtoken';

const pubKey = `
-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAq/dcIbhN35r3fpD5pid1Z/CM6n4RhwnDREJ/QCewSYiXtgik8GiM90BQtBBu7dRZuKwhaIDbEsf5yDouWEri1kM1AjE7WO9KJ2ZxvO3wro1biIuFMrafRtd0ZISsOc/mchbIAI5f2i/2B7sJbl3oTRkUHvh47GhtaHtRlh7NkWt4H5QktTem/jiPreTl/2wvYOuvBruScKDsQVbMUSXrxI4gkdJ+DTe/AJ740VO+H4VFOS4ohdBaEE83ExgiB/Mk9GaOVz6ZTMsnrHwwgXW9tl/0LwkvOA1BNVVYF3s2srXaeOrwxOQtkxY8mIQ1T/YaRFovFjafg0UVk9H8PKFkWQIDAQAB
-----END PUBLIC KEY-----
`;

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

export type UserInfo = {
	sub: string;
	email_verified: boolean;
	name: string;
	preferred_username: string;
	given_name: string;
	family_name: string;
	email: string;
};

export const load: LayoutServerLoad = async ({ cookies }) => {
	let payload: ATPayload | undefined;
	let userInfo: UserInfo | undefined;
	try {
		payload = jwt.verify(cookies.get('accessToken')!, pubKey, {
			algorithms: ['RS256']
		}) as ATPayload;
		console.log(payload);
		userInfo = await fetch(
			PUBLIC_KC_URL + '/realms/reviewanything/protocol/openid-connect/userinfo',
			{
				headers: {
					Authorization: 'Bearer ' + cookies.get('accessToken')
				}
			}
		).then((res) => res.json());
		console.log(userInfo);
	} catch (e) {
		console.error(e);
	}
	return {
		payload,
		userInfo
	};
};
