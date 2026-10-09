export type ContentSection = {
	heading: string;
	paragraphs: string[];
	items?: string[];
};
export type PublicPage = {
	path: string;
	title: string;
	description: string;
	heading: string;
	summary: string;
	updatedAt: string;
	indexable: boolean;
	kind: 'home' | 'guide' | 'hub' | 'information';
	reviewer?: string;
	sources: { title: string; url: string }[];
	sections: ContentSection[];
	related: string[];
	tutorial?: 'registration' | 'payslip';
};
export const rollout = {
	title: 'CAGD announcement: upgraded Government of Ghana pay-slip system',
	url: 'https://www.cagd.gov.gh/wp-content/uploads/2026/02/Press-Release-New-Pay-Slip.pdf',
};
export const videoSource = {
	title: 'CAGD Employee PayServices Registration video',
	url: 'https://www.youtube.com/watch?v=wraUiX0C8wk',
};
const base = {
	updatedAt: '2026-10-09',
	indexable: true,
	sources: [rollout],
	sections: [],
	related: [],
};
export const pages: PublicPage[] = [
	{
		...base,
		path: '/',
		kind: 'home',
		title: 'GoG ePay Services | Official Ghana E-Payslip Access',
		heading: 'Official Government of Ghana E-Payslip Services',
		description:
			'Access the official GoG ePay payslip application. Find Government of Ghana employee registration, sign-in, Ghana Card verification and account help.',
		summary:
			'The official starting point for Government of Ghana employee payslips.',
	},
	{
		...base,
		path: '/help/',
		kind: 'hub',
		title: 'GoG E-Payslip Help | Registration & Login Guides',
		heading: 'Help with your GoG e-payslip',
		description:
			'Find registration, sign-in, password recovery and payslip guides for Government of Ghana employees, with official sources and safe next steps.',
		summary:
			'Choose the task you need help with. Your account and payslip stay in the employee application.',
		related: [
			'/help/register/',
			'/help/sign-in/',
			'/help/reset-password/',
			'/help/view-payslip/',
			'/help/understand-payslip/',
			'/security/',
			'/contact/',
		],
	},
	{
		...base,
		path: '/help/register/',
		kind: 'guide',
		title: 'Register for Your GoG E-Payslip | Ghana Card & OTP',
		heading: 'How to register for your GoG e-payslip',
		description:
			'Follow the CAGD registration video: verify your employee number and Ghana Card, confirm your phone with an OTP, and create your payslip account.',
		summary:
			'First-time account setup uses your employee number, Ghana Card and a phone number you can access. The CAGD video begins at “Forgot password?” on the sign-in screen.',
		sources: [rollout, videoSource],
		tutorial: 'registration',
		sections: [
			{
				heading: 'What do I need before registering?',
				paragraphs: [
					'Have your employee number, complete Ghana Card number and access to your phone ready. A phone number is required; email is optional in the published registration instructions.',
				],
				items: [
					'Use your own employee and identity details.',
					'Ask HR to correct any locked employee fields that are wrong.',
					'Follow the current application if its screens have changed since the video.',
				],
			},
			{
				heading: 'What if my details do not match?',
				paragraphs: [
					'Check your employee number and Ghana Card carefully. If verification still fails, ask your employer’s HR or payroll administrator to check the record. Do not use another employee’s details.',
				],
			},
		],
		related: [
			'/help/sign-in/',
			'/help/reset-password/',
			'/contact/',
			'/security/',
		],
	},
	{
		...base,
		path: '/help/sign-in/',
		kind: 'guide',
		title: 'GoG E-Payslip Login Help | Official Employee Access',
		heading: 'How to sign in to your GoG e-payslip',
		description:
			'Open the official employee application, sign in with your Staff Number and password, and get help if you cannot access your Government of Ghana payslip.',
		summary:
			'Select “Log in to portal” to open the employee application. Enter your Staff Number and password on its sign-in screen, then follow any verification requested.',
		tutorial: 'payslip',
		sources: [rollout, videoSource],
		sections: [
			{
				heading: 'Where do I enter my password?',
				paragraphs: [
					'Enter account details only in the employee application’s authentication flow. This public information website does not collect your password. Start from the official website instead of a copied authentication link.',
				],
			},
			{
				heading: 'Why can I not sign in?',
				paragraphs: [
					'Check your Staff Number and password. If you have not set up access, follow the registration guide. If you already have an account but cannot remember its password, use the application’s recovery option. Repeated errors should be referred to the verified support channel or your payroll administrator.',
				],
			},
		],
		related: [
			'/help/register/',
			'/help/reset-password/',
			'/help/view-payslip/',
			'/security/',
		],
	},
	{
		...base,
		path: '/help/reset-password/',
		kind: 'guide',
		title: 'Forgot Your GoG E-Payslip Password? | Recovery Help',
		heading: 'Recover access to your GoG e-payslip account',
		description:
			'Use the official application’s Forgot password option to recover GoG e-payslip access. Learn what to check and where to get help safely.',
		summary:
			'For an existing account, open the employee application and select “Forgot password?” on the sign-in page. Follow the recovery instructions shown for your account.',
		sections: [
			{
				heading: 'How do I recover an existing account?',
				paragraphs: [
					'Recovery screens can change. Use the live application’s instructions rather than assuming that every registration step applies to an existing account.',
				],
				items: [
					'Start at the official application from this website.',
					'Select “Forgot password?” and supply only the information requested there.',
					'Keep verification codes and security answers private.',
					'After a successful reset, return to sign-in and use the new password.',
				],
			},
			{
				heading: 'What if I cannot receive a code?',
				paragraphs: [
					'Check the phone number shown in the application. Use its available retry option if appropriate. If your recorded number is incorrect or unavailable, contact your employer’s HR or payroll administrator for the approved next step. This website cannot change your account details.',
				],
			},
			{
				heading: 'Is registration the same as password recovery?',
				paragraphs: [
					'No. The published CAGD first-time registration video also starts at “Forgot password?”. New employees should use the registration guide; returning employees should follow the recovery process presented for their existing account.',
				],
			},
		],
		related: ['/help/register/', '/help/sign-in/', '/contact/', '/security/'],
	},
	{
		...base,
		path: '/help/view-payslip/',
		kind: 'guide',
		title: 'View Your Government of Ghana Payslip | GoG ePay',
		heading: 'How to view your Government of Ghana payslip',
		description:
			'Sign in to the GoG ePay employee application, choose the payslip area, check the pay period and review earnings, deductions and net pay.',
		summary:
			'Sign in to the employee application, open its payslip area and select the period you want to review. Available options depend on your account.',
		sections: [
			{
				heading: 'What should I check on my payslip?',
				paragraphs: [
					'Check that you are reviewing the correct pay period before comparing amounts.',
				],
				items: [
					'Confirm the period and employee details.',
					'Review earnings and each deduction.',
					'Check net pay against the figures shown.',
					'Note any missing payslip or unexpected amount for your payroll administrator.',
				],
			},
			{
				heading: 'Can I download or print my payslip?',
				paragraphs: [
					'Use a download or print option only if it is available in your application. Exact controls have not been documented here because verified dashboard screenshots were not supplied. Keep any saved file private and remove it from shared devices after use.',
				],
			},
			{
				heading: 'What if a payslip is missing?',
				paragraphs: [
					'Confirm the pay period and record what is missing. Contact your employer’s payroll administrator. Do not send your password or a verification code when asking for help. Sign out when finished.',
				],
			},
		],
		related: [
			'/help/sign-in/',
			'/help/understand-payslip/',
			'/contact/',
			'/security/',
		],
	},
	{
		...base,
		path: '/help/understand-payslip/',
		kind: 'guide',
		title: 'Understand Your Payslip | Gross Pay, Deductions & Net',
		heading: 'Understand the figures on your payslip',
		description:
			'Learn the difference between gross pay, deductions and net pay, and who to contact about unexpected amounts on your Government of Ghana payslip.',
		summary:
			'Gross pay is earnings before deductions. Net pay is the amount left after the deductions shown. Your own payslip may use different labels or include additional items.',
		sections: [
			{
				heading: 'What is gross pay?',
				paragraphs: [
					'Gross pay is your earnings before deductions. Depending on your record, this can include basic pay and allowances.',
				],
			},
			{
				heading: 'What are deductions?',
				paragraphs: [
					'Deductions are amounts taken from earnings, such as taxes, pension contributions or other items listed on your payslip. This guide does not determine whether a particular deduction is correct.',
				],
			},
			{
				heading: 'What is net pay?',
				paragraphs: [
					'Net pay is what remains after deductions. Compare the amounts for the same period: gross pay minus deductions equals net pay.',
				],
			},
			{
				heading: 'Who can explain an unexpected amount?',
				paragraphs: [
					'Your employer’s payroll administrator is the right starting point. Note the period and deduction label or amount you want clarified. Share personal payslip information only through the approved support process.',
				],
			},
		],
		related: ['/help/view-payslip/', '/contact/'],
	},
	{
		...base,
		path: '/security/',
		kind: 'information',
		title: 'Official GoG E-Payslip Addresses & Account Safety',
		heading: 'Recognize the official service and protect your account',
		description:
			'Check the official GoG ePay website and employee application addresses. Protect your password, verification codes and personal payslip information.',
		summary:
			'Start at www.epayslipgh.com and use its login button to reach the employee application. Check the complete address before entering account details.',
		sections: [
			{
				heading: 'How do I check a payslip link?',
				paragraphs: [
					'A familiar logo or a high search position does not prove that a website is official. Compare the whole address with the domains shown on this website and the current CAGD announcement. HTTPS protects the connection but does not establish government ownership.',
				],
			},
			{
				heading: 'What should I keep private?',
				paragraphs: [
					'Keep your password, OTP and security answer to yourself. Do not allow someone who contacted you unexpectedly to sign in on your behalf. Do not post payslip or identity details publicly.',
				],
			},
			{
				heading: 'What if a website appears to impersonate the service?',
				paragraphs: [
					'Close it and return to the official starting address. Use the verified CAGD contact page for the appropriate reporting channel. If you record a suspicious URL or screenshot, omit your own account information. An independent article about the service is not automatically an impersonation.',
				],
			},
			{
				heading: 'What if I used a shared device?',
				paragraphs: [
					'Sign out of the application, close it, avoid saving passwords and remove downloaded payslips from the device. If you disclosed credentials, use the official recovery process and contact verified support.',
				],
			},
		],
		related: ['/about/', '/help/reset-password/', '/contact/'],
	},
	{
		...base,
		path: '/about/',
		kind: 'information',
		title: 'About GoG ePay Services | Official Payslip Information',
		heading: 'About GoG ePay Services',
		description:
			'Understand the role of the official GoG ePay information website, its employee application and CAGD’s published registration resources.',
		summary:
			'This website helps Government of Ghana employees find the official payslip application and understand how to access it.',
		sections: [
			{
				heading: 'What is the service for?',
				paragraphs: [
					'CAGD’s published announcement identifies gogepayservices.com as the starting address for the upgraded Government of Ghana electronic pay-slip system. This public website provides access guidance; account information is handled by the employee application.',
				],
			},
			{
				heading: 'Where do the guides come from?',
				paragraphs: [
					'Registration guidance follows the CAGD announcement, instructional video and supplied redacted screenshots. General payslip guidance explains common terms and directs individual payroll questions to the employer. Sources are linked on each relevant page.',
				],
			},
			{
				heading: 'How are corrections handled?',
				paragraphs: [
					'Use the verified contact route if an instruction no longer matches the application. Instructions should be checked whenever the application changes. Content revision dates describe changes to these pages and do not imply a completed government review.',
				],
			},
		],
		related: ['/contact/', '/security/', '/help/'],
	},
	{
		...base,
		path: '/contact/',
		kind: 'information',
		title: 'GoG E-Payslip Support | Verified Contact Routes',
		heading: 'Get help through the right support channel',
		description:
			'Find verified CAGD contact information and learn when to ask your employer’s HR or payroll administrator about GoG e-payslip access and pay.',
		summary:
			'For employee record corrections or pay discrepancies, start with your employer’s HR or payroll administrator. For CAGD service enquiries, use its current official contact page.',
		sources: [
			rollout,
			{
				title: 'CAGD official contact page',
				url: 'https://cagd.gov.gh/contact',
			},
		],
		sections: [
			{
				heading: 'When should I contact HR or payroll?',
				paragraphs: [
					'Ask HR about locked identity or employee fields that are incorrect. Ask payroll about missing payslips, unexpected deductions or figures for a particular pay period.',
				],
			},
			{
				heading: 'Where can I find CAGD contact details?',
				paragraphs: [
					'Follow the official contact page linked below for current channels and regional offices. Phone numbers are not copied here because they can change.',
				],
			},
			{
				heading: 'What should I include when asking for help?',
				paragraphs: [
					'Describe the problem, the affected pay period if relevant and the message shown by the application. Do not include passwords, verification codes or security answers. Share employee information only when required through a verified support process.',
				],
			},
		],
		related: ['/help/reset-password/', '/help/register/', '/security/'],
	},
	{
		...base,
		path: '/privacy/',
		kind: 'information',
		title: 'Privacy | GoG ePay Information Website',
		heading: 'Privacy on this information website',
		description:
			'Learn what this public GoG ePay website collects, how external login and video links work, and where account and payslip information is handled.',
		summary:
			'This public website does not ask for account credentials or collect payslip information. Login and account management take place in the separate employee application.',
		sections: [
			{
				heading: 'Website visits',
				paragraphs: [
					'The site has no account form and does not currently load Google Analytics or advertising scripts. The hosting provider may process ordinary request information, such as IP address and browser details, to deliver and secure the website.',
				],
			},
			{
				heading: 'The employee application',
				paragraphs: [
					'Opening the login link takes you to another website. Its account, authentication and payroll processing are governed by the application’s own privacy information. This page describes the public information website only.',
				],
			},
			{
				heading: 'Watching the tutorial',
				paragraphs: [
					'The embedded video is loaded from YouTube’s privacy-enhanced player only after you choose Play. YouTube receives request information when the player loads or when you follow a YouTube link. The written guide is available without loading the player.',
				],
			},
			{
				heading: 'Search measurement and future analytics',
				paragraphs: [
					'The operator may use aggregate Google Search Console and Bing Webmaster Tools reports to understand search visibility. Any future visitor analytics must be configured and disclosed before activation. Credentials, identity numbers, authentication parameters and payslip contents must not be included in analytics events.',
				],
			},
			{
				heading: 'Privacy enquiries',
				paragraphs: [
					'Use the verified contact route linked below for service enquiries. Do not send sensitive account details through unverified channels.',
				],
			},
		],
		related: ['/contact/', '/security/'],
	},
];
export const pageFor = (path: string) =>
	pages.find((page) => page.path === path);
export const mainLinks = [
	{ path: '/about/', label: 'About' },
	{ path: '/help/register/', label: 'How it works' },
	{ path: '/help/', label: 'Help & FAQs' },
];
