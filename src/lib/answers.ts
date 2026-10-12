import type { SourceReference } from './pages';
export type Answer = {
	id: string;
	linkLabel: string;
	question: string;
	answer: string;
	guide: string;
	sources?: SourceReference[];
};
export const answersByPath: Record<string, Answer[]> = {
	'/': [
		{
			id: 'gog-payslip-login',
			question: 'Where do I log in to my GoG e-payslip?',
			answer:
				'Open gogepayservices.com to sign in to the employee application. This website at www.epayslipgh.com provides public information and guides; it does not ask for your password or display your payslip.',
			guide: '/help/sign-in/',
			linkLabel: 'GoG e-payslip login instructions',
		},
		{
			id: 'check-payslip-online',
			question: 'How do I check my e-payslip online?',
			answer:
				'Sign in to the employee application, open its payslip area and select the pay period you want to review. Check your earnings, deductions and net pay, then sign out when finished.',
			guide: '/help/view-payslip/',
			linkLabel: 'Check your e-payslip online',
		},
		{
			id: 'register-gog-epay',
			question: 'How do I register for GoG ePay?',
			answer:
				'Follow the CAGD registration guide to verify your employee number and Ghana Card, confirm your phone using an OTP and complete account setup. The published registration video begins with the Forgot password link on the sign-in screen.',
			guide: '/help/register/',
			linkLabel: 'GoG e-payslip registration guide',
		},
		{
			id: 'forgotten-payslip-password',
			question: 'How do I reset my GoG e-payslip password?',
			answer:
				'For an existing account, open gogepayservices.com and select “Forgot password?” on its sign-in page. Follow the recovery instructions shown. If your recorded phone number is incorrect or unavailable, ask your employer’s HR or payroll administrator for the approved next step.',
			guide: '/help/reset-password/',
			linkLabel: 'GoG e-payslip password recovery',
		},
		{
			id: 'missing-or-incorrect-payslip',
			question: 'What if my GoG payslip is missing or an amount looks wrong?',
			answer:
				'Check that you selected the correct pay period. If the payslip is still missing or an amount needs explaining, contact your employer’s payroll administrator with the period and the item you want clarified. Keep passwords and verification codes private.',
			guide: '/contact/',
			linkLabel: 'Payslip support and contact routes',
		},
		{
			id: 'shared-computer-payslip',
			question: 'Can I check my e-payslip on a shared computer?',
			answer:
				'Use care on a shared computer: do not save your password, sign out of the employee application when finished and remove any downloaded payslip before leaving. Keep your account and identity details private.',
			guide: '/security/',
			linkLabel: 'Protect your payslip account',
		},
		{
			id: 'check-payslip-link',
			question: 'How do I check whether a payslip login link is safe?',
			answer:
				'Start at www.epayslipgh.com and use its login button to open gogepayservices.com. Check the full hostname before entering account details; authentication uses auth.gogepayadmin.com. A familiar logo alone does not prove a link is official. Never share your password or verification code.',
			guide: '/security/',
			linkLabel: 'Official addresses and account safety',
		},
	],
	'/help/': [
		{
			id: 'choose-payslip-guide',
			question: 'Which guide should I use for my GoG payslip?',
			answer:
				'Use the registration guide for first-time account setup, the sign-in guide for an existing account, and the password recovery guide if you cannot access your account. Payslip and account actions take place in the employee application.',
			guide: '/help/sign-in/',
			linkLabel: 'GoG e-payslip login instructions',
		},
		{
			id: 'missing-payslip-support',
			question:
				'Who can help with a missing payslip or incorrect account details?',
			answer:
				'Contact your employer’s HR or payroll administrator for the approved support route. This public website cannot change employee records, account details or payslip amounts.',
			guide: '/contact/',
			linkLabel: 'Payslip support and contact routes',
		},
	],
	'/help/register/': [
		{
			id: 'registration-requirements',
			question: 'What do I need to register for my GoG e-payslip?',
			answer:
				'The CAGD registration tutorial uses your employee number, Ghana Card information and access to the phone receiving your verification code. Follow the live application’s prompts and keep passwords, OTPs and security answers private.',
			guide: '/security/',
			linkLabel: 'Official domains and account safety',
		},
	],
	'/help/sign-in/': [
		{
			id: 'staff-number-login',
			question: 'How do I log in to the GoG e-payslip application?',
			answer:
				'Open gogepayservices.com and follow its sign-in screen. Enter your Staff Number and password in the employee application. If you cannot remember your password, use its Forgot password option.',
			guide: '/help/reset-password/',
			linkLabel: 'GoG e-payslip password recovery',
		},
	],
	'/help/reset-password/': [
		{
			id: 'verification-code-help',
			question:
				'What should I do if my payslip verification code does not arrive?',
			answer:
				'Check the phone number shown by the application and use its available retry option if appropriate. If your recorded number is incorrect or unavailable, contact your employer’s HR or payroll administrator. Do not share an OTP or password with anyone offering help.',
			guide: '/contact/',
			linkLabel: 'Payslip support and contact routes',
		},
	],
	'/help/view-payslip/': [
		{
			id: 'download-payslip',
			question: 'Can I download my GoG e-payslip?',
			answer:
				'Use a download or print option if your employee application offers one. Available controls depend on your account and the current application. Keep saved payslips private and remove them from shared devices after use.',
			guide: '/security/',
			linkLabel: 'Official domains and account safety',
		},
	],
	'/help/understand-payslip/': [
		{
			id: 'gross-and-net-pay',
			question: 'What is the difference between gross pay and net pay?',
			answer:
				'Gross pay is your earnings before deductions. Net pay is the amount remaining after the deductions shown on your payslip. Ask your employer’s payroll administrator about missing payments or unexpected deductions.',
			guide: '/contact/',
			linkLabel: 'Payslip support and contact routes',
		},
	],
	'/security/': [
		{
			id: 'official-service-addresses',
			question: 'Which addresses should I check before signing in?',
			answer:
				'Use www.epayslipgh.com for public information and gogepayservices.com for the employee application. Account authentication uses auth.gogepayadmin.com. Check the full hostname before entering account information, and never share passwords or verification codes.',
			guide: '/help/sign-in/',
			linkLabel: 'GoG e-payslip login instructions',
		},
	],
};
