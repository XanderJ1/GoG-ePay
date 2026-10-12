import { loadContent, validateContent } from './content-validation.mjs';
const { pages, answers } = await loadContent();
validateContent(pages, answers);
console.log('Content references, reviewers and dates validated.');
