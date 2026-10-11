export type Answer = { question: string; answer: string; guide: string };
export const answersByPath: Record<string, Answer[]> = {
	'/': [
		{
			question: 'Where do I log in to my GoG e-payslip?',
			answer:
				'Open gogepayservices.com to sign in to the employee application. This website at www.epayslipgh.com provides public information and guides; it does not ask for your password or display your payslip.',
			guide: '/help/sign-in/',
		},
		{
			question: 'How do I check my e-payslip online?',
			answer:
				'Sign in to the employee application, open its payslip area and select the pay period you want to review. Check your earnings, deductions and net pay, then sign out when finished.',
			guide: '/help/view-payslip/',
		},
		{
			question: 'How do I register for GoG ePay?',
			answer:
				'Follow the CAGD registration guide to verify your employee number and Ghana Card, confirm your phone using an OTP and complete account setup. The published registration video begins with the Forgot password link on the sign-in screen.',
			guide: '/help/register/',
		},
	],
	'/help/': [
		{
			question: 'Which guide should I use for my GoG payslip?',
			answer:
				'Use the registration guide for first-time account setup, the sign-in guide for an existing account, and the password recovery guide if you cannot access your account. Payslip and account actions take place in the employee application.',
			guide: '/help/sign-in/',
		},
		{
			question:
				'Who can help with a missing payslip or incorrect account details?',
			answer:
				'Contact your employer’s HR or payroll administrator for the approved support route. This public website cannot change employee records, account details or payslip amounts.',
			guide: '/contact/',
		},
	],
	'/help/register/': [
		{
			question: 'What do I need to register for my GoG e-payslip?',
			answer:
				'The CAGD registration tutorial uses your employee number, Ghana Card information and access to the phone receiving your verification code. Follow the live application’s prompts and keep passwords, OTPs and security answers private.',
			guide: '/security/',
		},
	],
	'/help/sign-in/': [
		{
			question: 'How do I log in to the GoG e-payslip application?',
			answer:
				'Open gogepayservices.com and follow its sign-in screen. Enter your Staff Number and password in the employee application. If you cannot remember your password, use its Forgot password option.',
			guide: '/help/reset-password/',
		},
	],
	'/help/reset-password/': [
		{
			question:
				'What should I do if my payslip verification code does not arrive?',
			answer:
				'Check the phone number shown by the application and use its available retry option if appropriate. If your recorded number is incorrect or unavailable, contact your employer’s HR or payroll administrator. Do not share an OTP or password with anyone offering help.',
			guide: '/contact/',
		},
	],
	'/help/view-payslip/': [
		{
			question: 'Can I download my GoG e-payslip?',
			answer:
				'Use a download or print option if your employee application offers one. Available controls depend on your account and the current application. Keep saved payslips private and remove them from shared devices after use.',
			guide: '/security/',
		},
	],
	'/help/understand-payslip/': [
		{
			question: 'What is the difference between gross pay and net pay?',
			answer:
				'Gross pay is your earnings before deductions. Net pay is the amount remaining after the deductions shown on your payslip. Ask your employer’s payroll administrator about missing payments or unexpected deductions.',
			guide: '/contact/',
		},
	],
	'/security/': [
		{
			question: 'Which addresses should I check before signing in?',
			answer:
				'Use www.epayslipgh.com for public information and gogepayservices.com for the employee application. Account authentication uses auth.gogepayadmin.com. Check the full hostname before entering account information, and never share passwords or verification codes.',
			guide: '/help/sign-in/',
		},
	],
};
