import { PUBLIC_KC_URL } from '$env/static/public';
import { authenticate, type ATPayload } from '$lib/server/auth';
import type { LayoutServerLoad } from './$types';

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
    payload = await authenticate(cookies);
    //console.log(payload);
    if (payload) {
      console.log('ASJHDUUIOASHD UYAWgduaqygyuad');
      userInfo = await fetch(
        PUBLIC_KC_URL + '/realms/reviewanything/protocol/openid-connect/userinfo',
        {
          headers: {
            Authorization: 'Bearer ' + cookies.get('accessToken')
          }
        }
      ).then((res) => res.json());
      //console.log(userInfo);
    }
  } catch (e) {
    console.error(e);
  }
  return {
    payload,
    userInfo
  };
};
