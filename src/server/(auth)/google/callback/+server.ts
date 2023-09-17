import { auth, googleAuth } from '../../../lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { fail, redirect } from '@sveltejs/kit';

export const GET = async ({ url, cookies, locals }) => {
  console.log("Response From Callback")
  const session = await locals.auth.validate();
  if (session) {
    throw redirect(302, '/')
  }
  const storedState = cookies.get('google_oauth_state');
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    throw fail(400)
  }
  try {
    const { getExistingUser, googleUser, googleTokens, createUser } = await googleAuth.validateCallback(code);

    const getUser = async () => {
      try {
        const existingUser = await getExistingUser();
        if (existingUser) return existingUser;
      } catch (error) {
        console.log(error)
      }
      const user = await createUser({
        attributes: {
          name: googleUser.given_name,
          image: googleUser.picture,
          email: googleUser.email
        }
      });
      return user;
    };
    console.log("FETCHING USER")
    const user = await getUser();
    console.log("USER", user)
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {
        access_token: googleTokens.accessToken,
        refresh_token: googleTokens.refreshToken
      }
    });
    locals.auth.setSession(session);
    throw redirect(302, "/")
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      throw e
    }
    throw fail(500)
  }
};