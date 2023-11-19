import { auth, twilioClient } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';
import type { Key, User } from 'lucia';
import { createId } from '@paralleldrive/cuid2';

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	sendOTP: async ({ request, locals }) => {
		const form = await request.formData();
		const fullName = form.get('full-name')!;
		const phoneNumber = form.get('phone-number');
		const password = form.get('password')!;
		if (phoneNumber === null) return fail(404, { error: 'Phone Number has Null Value' });
		if (password === null) return fail(404, { error: 'Password has Null Value' });
		console.log(phoneNumber.toString());
		let key: Key | null = null;
		try {
			key = await auth.getKey('sms', `+91${phoneNumber.toString()}`);
		} catch (error) {
			console.log(error)
		}
		if(key !== null) return fail(404, {error: 'User Already Exist In Database'})
		try {
			const { status, to } = await twilioClient.sendVarificationCode(
				`+91${phoneNumber.toString()}`,
				password.toString()
			);
			console.log("\nVarificationCode Status:",status)
      const id = createId()
      const createUser = async ({attributes}:{attributes:Omit<User,'id'| 'userId' | 'phone_number' | 'phone_number_verified'>}) => {
        return await auth.createUser({
          attributes: {
            id,
            phone_number: to,
            phone_number_verified: false,
            ...attributes,
          },
          key: {
            password:password.toString(),
            providerId: 'sms',
            providerUserId: to,
          },
          userId: id,
        })
      };
      const getExistingUser = async () => {
        try {
          const res = await auth.getKey('sms', `+91${phoneNumber.toString()}`)
          return await auth.getUser(res?.userId)
        } catch (error) {
          return null
        }
      }
			const getUser = async () => {
				const existingUser = await getExistingUser();
				console.log('EXISTING USER', existingUser);
				if (existingUser !== null) return existingUser;
				const user = await createUser({
					attributes: {
						name: fullName?.toString(),
						username: null,
						email: null,
						image: null,
						bio: null
					}
				});
				console.log('New User Created', user);
				return user;
			};
			const user = await getUser();
			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
			return {
				status: status
			};
		} catch (error) {
			console.log(error);
			return fail(404, { error: true });
		}
	},
	verifyOTP: async ({ request, locals }) => {
		const form = await request.formData();
		const otpCode = form.get('otp-code');
		const fullName = form.get('full-name');
		const phoneNumber = form.get('phone-number');
		const password = form.get('password');
		console.log(phoneNumber, fullName, password);
		if (otpCode === null) return fail(404, { error: 'OTP Undefined' });
		if (phoneNumber === null) return fail(404, { error: 'Phone Number Undefined' });
		if (password === null) return fail(404, { error: 'Password Undefined' });
		try {
			const { verified, to } = await twilioClient.validateCode(
				`+91${phoneNumber.toString()}`,
				otpCode.toString()
			);
			if (!verified) return fail(404, { error: 'INCORRECT OTP CODE' });
			console.log('VERIFIED');
			const res = await auth.getKey('sms', to)
      const user =  await auth.getUser(res?.userId)
      if(verified) {
        await auth.updateUserAttributes(user.id,{
          phone_number_verified: verified
        })
      }
			return {
				verified
			};
		} catch (error) {
			console.log(error);
			return fail(404, { error: true });
		}
	}
};
