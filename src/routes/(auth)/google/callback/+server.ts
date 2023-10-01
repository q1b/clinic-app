import { isOsteopath } from '$lib/helpers/utils.js';
import { db } from '$lib/server/db/index.js';
import { osteopath as osteopathTable } from '$lib/server/db/schema/index.js';
import { auth, googleAuth } from '$lib/server/lucia.js';
import { OAuthRequestError } from '@lucia-auth/oauth';

export const GET = async ({ url, cookies, locals }) => {
  console.log("Response From Callback")
  const session = await locals.auth.validate();
  if (session) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  }
  const storedState = cookies.get('google_oauth_state');
  const state = url.searchParams.get('state');
  const code = url.searchParams.get('code');
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400
    });
  }
  try {
    const { getExistingUser, googleUser, googleTokens, createUser } = await googleAuth.validateCallback(code);
    console.log("GOOGLE USER", googleUser, "\n", "GOOGLE TOKEN", JSON.stringify(googleTokens, null, 2))
    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          name: googleUser.given_name,
          image: googleUser.picture,
          email: googleUser.email,
          bio: null,
          phone_number: null
        }
      });
      if( isOsteopath(googleUser.email) ) {
        try {
          console.log("Creating Osteopath Account")
          await db.insert(osteopathTable).values({
            userId: user.id,
          })
          console.log("Successfully, Created Osteopathy Account")
        } catch (error) {
          console.log(error)
        }
      }
      return user;
    };
    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {
        access_token: googleTokens.accessToken,
        refresh_token: googleTokens.refreshToken
      }
    });
    locals.auth.setSession(session);
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    });
  } catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400
      });
    }
    return new Response(null, {
      status: 500
    });
  }
};