import fs from 'node:fs/promises';
import sharp from 'sharp';

// A deterministic brand graphic, built from our existing authorised logo.
const logo = (await fs.readFile('site/assets/cagd-logo.png')).toString(
	'base64',
);
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
 <rect width="1200" height="630" fill="#f7f9f2"/>
 <rect width="1200" height="16" fill="#007a3d"/>
 <rect y="610" width="1200" height="20" fill="#e8b51b"/>
 <image href="data:image/png;base64,${logo}" x="65" y="50" width="150" height="150"/>
 <g font-family="Segoe UI, Arial, sans-serif">
 <text x="250" y="110" font-size="43" font-weight="700" fill="#123d2a">GoG ePay Services</text>
 <text x="250" y="155" font-size="23" fill="#007a3d">GOVERNMENT OF GHANA</text>
 <text x="70" y="300" font-size="66" font-weight="700" fill="#123d2a">Your GoG e-payslip.</text>
 <text x="70" y="382" font-size="52" font-weight="700" fill="#123d2a">Official access and help.</text>
 <text x="70" y="454" font-size="29" fill="#526657">Registration · Login · Password recovery</text>
 <text x="70" y="555" font-size="32" font-weight="600" fill="#007a3d">www.epayslipgh.com</text>
 </g>
</svg>`;
const png = await sharp(Buffer.from(svg)).png().toBuffer();
await fs.writeFile('site/assets/cagd-social-card.png', png);
// Old shared links still receive current artwork, never the retired icon.
await fs.writeFile('site/assets/social-card.png', png);
