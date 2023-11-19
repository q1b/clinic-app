import type { Actions, PageServerLoad } from "./$types";

export const load = (async () => {
    return {};
}) satisfies PageServerLoad;

export const actions: Actions = {
	default: async ({request}) => {
		const form = await request.formData();
		const phoneNumber = form.get('phone-number')!;
		const password = form.get('password')!;
		console.log(phoneNumber.toString())
		return {
			verified: true
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