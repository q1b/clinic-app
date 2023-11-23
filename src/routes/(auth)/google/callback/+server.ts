import { db } from '$lib/shared/db/index.js';
import { osteopath, osteopath as osteopathTable, user } from '$lib/shared/db/schema/index.js';
import { setGoogleTokens } from '$lib/server/kv.js';
import { auth, googleAuth } from '$lib/server/lucia.js';
import { extractFromEmail } from '$lib/utils/index.js';
import { OAuthRequestError } from '@lucia-auth/oauth';
import { eq } from 'drizzle-orm';

// Handle Connect and Auth Both
export const GET = async (event) => {
	event.locals.auth = auth.handleRequest(event);
  event.locals.session = await event.locals.auth.validate();
	const sessionUserId = event.locals.session?.user.id;
	if (!sessionUserId)
		return new Response(null, {
			status: 302,
			headers: {
				Location: '/login'
			}
		});
	const storedState = event.cookies.get('google_oauth_state');
	const state = event.url.searchParams.get('state');
	const code = event.url.searchParams.get('code');
	// validate state
	if (!storedState || !state || storedState !== state || !code) {
		return new Response(null, {
			status: 400
		});
	}
	try {
		const { getExistingUser, googleUser, googleTokens, createUser } =
			await googleAuth.validateCallback(code);
		console.log("\n\n\n Google Tokens Renewed! \n\n\n")
		await setGoogleTokens(sessionUserId, {
			access_token: googleTokens.accessToken,
			refersh_token: googleTokens.refreshToken
		});
		console.log(googleUser);
		const getUser = async () => {
			let osteopathId: null | string = null;
			const details = extractFromEmail(googleUser.email);
			let isOsteopath = details?.batch === 'bos' || details?.batch === 'mos';
			const existingUser = await getExistingUser();
			if(existingUser?.email === null) {
				const res= await auth.updateUserAttributes(sessionUserId,{
					email: googleUser.email,
					image: existingUser.image === null ? googleUser.picture : existingUser.image,
					role: 'osteopath'
				}) 
				existingUser.email = res.email
				existingUser.image = existingUser.image === null ? googleUser.picture : existingUser.image
			}
			if (existingUser) {
				if (isOsteopath) {
          const res = await db.query.osteopath.findFirst({
            where: eq( osteopath.userId, existingUser.id )
          })
          if(res) {
					  osteopathId = res.id;   
          }else{
            console.log('Creating Osteopath Account');
            const res = await db
              .insert(osteopathTable)
              .values({
                userId: existingUser.id
              })
              .returning();
            osteopathId = res[0].id;
            console.log('Successfully, Created Osteopathy Account');
          }
				}
				return {
					...existingUser,
					osteopathId
				}
			}
			console.log('CREATING NEW KEY');
			const key = await auth.createKey({
				password: null,
				providerId: 'google',
				providerUserId: googleUser.sub,
				userId: sessionUserId
			})
      console.log("New Key CREATED", key)
			await auth.updateUserAttributes(sessionUserId,{
				image: googleUser.picture,
				email: googleUser.email
			})
			if (isOsteopath && osteopath === undefined) {
				try {
					console.log('Creating Osteopath Account');
					const res = await db
						.insert(osteopathTable)
						.values({
							userId: sessionUserId
						})
						.returning();
					osteopathId = res[0].id;
					await auth.updateUserAttributes(sessionUserId,{
						image: googleUser.picture,
						email: googleUser.email,
						role: 'osteopath'
					})
					console.log('Successfully, Created Osteopathy Account');
				} catch (error) {
					console.log(error);
				}
			}
			return {
				...user,
				osteopathId
			};
		};
		await getUser();
		// const session = await auth.createSession({
		// 	userId: user.userId,
		// 	attributes: {
		// 		osteopathId: user.osteopathId
		// 	}
		// });
		// locals.auth.setSession(session);
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
