import { twilioAuth } from '$lib/server/lucia';
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import type { PageServerLoad } from './$types';

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	sendOTP: async ({ request, cookies }) => {
		const form = await request.formData();
		const fullName = form.get('full-name')!;
		const phoneNumber = form.get('phone-number')!;
		const password = form.get('password')!;
		try {
			const result = await twilioAuth.sendVarificationCode(`+91 ${phoneNumber.toString()}`);
			console.log(result);
			return {
				status: result.status
			}
		} catch (error) {
			console.log(error)
			return fail(404,{error:true})
		}
	},
	verifyOTP: async ({request, cookies}) => {
		const form = await request.formData();
		const otpCode = form.get('otp-code');
		const fullName = form.get('full-name');
		const phoneNumber = form.get('phone-number');
		const password = form.get('password');
		console.log(phoneNumber, fullName, password)
		if(otpCode === null) return fail(404,{error: 'OTP Undefined'})
		try {
			const { verified, createUser, getExistingUser } = await twilioAuth.validateCode(`+91 ${phoneNumber}`, otpCode.toString());
			if(verified) console.log("VERIFIED")
			else console.log("UNVERIFIED")
			return {
				verified
			}
		} catch (error) {
			console.log(error)
			return fail(404,{error:true})
		}
	},
	// default: async (requestEvent) => {
	// 	const form = await requestEvent.request.formData();
	// 	const stage = form.get('stage');
	// 	const fullName = form.get('full-name');
	// 	const phoneNumber = form.get('phone-number');
	// 	const otpCode = form.get('otp-code');
	// 	console.log(
	// 		`\nStage: ${stage}\nFull Name: ${fullName}\nPhone Number: ${phoneNumber}\nOTP CODE: ${otpCode}`
	// 	);
	// 	// send the otp
	// 	let result;
	// 	if (stage === 'idle' || stage === 'sending') {
	// 		if (phoneNumber)
	// 			result = await twilioAuth.sendVarificationCode(`+91 ${phoneNumber.toString()}`);
	// 		console.log('SEND ', result);
	// 		return {
	// 			sended: true,
	// 			verified: false
	// 		};
	// 	}
	// 	// verify the otp
	// 	if ((stage === 'sended' || stage === 'unverified') && otpCode && phoneNumber) {
	// 		const { verified, createUser, getExistingUser } = await twilioAuth.validateCode(`+91 ${phoneNumber.toString()}`, otpCode.toString());
	// 		return {
	// 			sended: true,
	// 			verified 
	// 		};
	// 	}
	// 	return {
	// 		sended: false,
	// 		verified: false
	// 	};
	// }
};