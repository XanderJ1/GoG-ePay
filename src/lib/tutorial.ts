export type GuideStep = {
	title: string;
	subtitle: string;
	heading: string;
	description: string;
	instructions: string[];
	tip: string;
	image?: string;
	alt?: string;
	caption?: string;
	videoStart?: number;
};
export const REGISTRATION_VIDEO_URL =
	'https://www.youtube.com/watch?v=wraUiX0C8wk';
export const registrationSteps: GuideStep[] = [
	{
		title: 'Start registration',
		subtitle: 'Open the portal and choose recovery',
		heading: 'Start with “Forgot password?”.',
		description:
			'Open the employee portal. The CAGD registration video starts from the “Forgot password?” link on the sign-in screen.',
		instructions: [
			'Check that you are at the portal address shown on this page.',
			'Select “Forgot password?” below the Password field.',
		],
		tip: 'The video uses this route to set up access. Follow the current portal if its instructions have changed.',
		image: 'sign-in-help.webp',
		alt: 'Sign-in screen highlighting the Forgot password link below empty Staff Number and Password fields',
		caption: 'Select the highlighted “Forgot password?” link.',
		videoStart: 20,
	},
	{
		title: 'Employee number',
		subtitle: 'Identify your employee record',
		heading: 'Enter your employee number.',
		description: 'Use your employee number to start the account setup process.',
		instructions: [
			'Enter your Employee Number in the field shown.',
			'Select “Continue” to move to identity verification.',
		],
		tip: 'If your employee record cannot be found, ask your employer’s payroll administrator or HR department for help.',
		image: 'employee-number.webp',
		alt: 'Employee Number entry screen with the number obscured and arrows pointing to the field and Continue button',
		caption: 'Enter Employee Number, then select “Continue”.',
		videoStart: 24,
	},
	{
		title: 'Ghana Card',
		subtitle: 'Verify your identity',
		heading: 'Verify your Ghana Card.',
		description:
			'The portal checks your identity against the Ghana Card information on your employee record.',
		instructions: [
			'Enter your complete Ghana Card number.',
			'Select “Verify Ghana Card” to continue.',
		],
		tip: 'Check the full number carefully. If the record does not match, contact HR rather than entering someone else’s details.',
		image: 'ghana-card.webp',
		alt: 'Verify Ghana Card screen with personal details obscured and arrows highlighting Ghana Card Number and Verify Ghana Card',
		caption: 'Enter the complete number and select “Verify Ghana Card”.',
		videoStart: 31,
	},
	{
		title: 'Profile details',
		subtitle: 'Check your details and phone number',
		heading: 'Confirm your profile.',
		description:
			'Review your employee details and update the contact information used for verification.',
		instructions: [
			'Check your employee number, name, Ghana Card number and date of birth.',
			'Add or update your phone number; this is required. Email is optional.',
			'Select “Next” after checking your details.',
		],
		tip: 'The video directs you to HR for corrections to greyed-out fields. Those fields cannot be changed here.',
		image: 'profile-details.webp',
		alt: 'Complete Your Profile form showing employee and contact fields with identity details obscured',
		caption:
			'Check the profile fields and supply a phone number you can access.',
		videoStart: 40,
	},
	{
		title: 'Phone verification',
		subtitle: 'Confirm the code sent to your phone',
		heading: 'Verify your phone number.',
		description:
			'The portal asks you to confirm your phone number before sending a one-time password (OTP).',
		instructions: [
			'Check the phone number in the confirmation prompt.',
			'Select “Yes” to request the OTP.',
			'Enter the code you receive and select “Verify OTP”.',
		],
		tip: 'Keep the OTP private. If it does not arrive, follow the portal’s available retry instructions or ask your payroll administrator for help.',
		videoStart: 60,
	},
	{
		title: 'Password & security',
		subtitle: 'Set up your account credentials',
		heading: 'Choose your password and security question.',
		description:
			'Set your new password and a security answer for future password recovery.',
		instructions: [
			'Enter your new password, then enter it again to confirm.',
			'Choose a security question and supply your answer.',
			'Select “Next” to reach the review page.',
		],
		tip: 'Follow the password requirements shown by the portal. Keep your password and security answer private.',
		videoStart: 76,
	},
	{
		title: 'Review & sign in',
		subtitle: 'Finish registration and access your account',
		heading: 'Review, register, then sign in.',
		description:
			'Check the summary before completing your account registration.',
		instructions: [
			'Review your information and read the confirmation beside the checkbox.',
			'If the details are correct and you agree, select the checkbox and “Register Account”.',
			'After the success message, select “Go to Login”.',
			'Enter your Staff Number and new Password, then select “Sign In”.',
		],
		tip: 'If the confirmation shows incorrect information, go back and correct it before registering.',
		videoStart: 92,
	},
];
export const payslipSteps: GuideStep[] = [
	{
		title: 'Open your portal',
		subtitle: 'Start at the correct address',
		heading: 'Begin at the right address.',
		description:
			'Select “Open the portal” to continue to the existing employee application.',
		instructions: ['Check the portal address before entering your details.'],
		tip: 'You do not enter a password on this information website.',
		image: 'portal.webp',
		alt: 'GoG Employee Self Service welcome and sign-in screen with credentials obscured',
		caption: 'The portal has Staff Number and Password fields.',
	},
	{
		title: 'Sign in',
		subtitle: 'Use your existing credentials',
		heading: 'Welcome back.',
		description: 'Enter your Staff Number and Password, then select “Sign In”.',
		instructions: [
			'Check your details before submitting.',
			'Follow any additional verification requested by the portal.',
		],
		tip: 'If you need to recover access, use “Forgot password?” and follow the portal’s instructions.',
		image: 'sign-in-help.webp',
		alt: 'Portal sign-in screen highlighting the Forgot password link',
		caption: 'Use “Forgot password?” if you cannot sign in.',
	},
	{
		title: 'Review your payslip',
		subtitle: 'Check the period and pay details',
		heading: 'Give your payslip a moment.',
		description:
			'Once signed in, open the payslip area and follow the options available in your account.',
		instructions: [
			'Check the pay period.',
			'Review your earnings and deductions.',
			'Check the net pay amount.',
		],
		tip: 'For an unexpected deduction or missing payslip, note the period and contact your payroll administrator.',
	},
	{
		title: 'Finish safely',
		subtitle: 'Protect your account and downloads',
		heading: 'All done? Sign out.',
		description:
			'Use the portal’s sign-out option when you finish, especially on a shared computer.',
		instructions: [
			'Avoid saving your password on public devices.',
			'Keep any downloaded payslip private.',
			'Sign out and close the portal.',
		],
		tip: 'Remove downloaded payslip files from shared devices when you are finished.',
	},
];
