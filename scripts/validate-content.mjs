import {loadContent,validateContent} from './lib/content.mjs';
const result=validateContent(loadContent());
if(result.errors.length){console.error(result.errors.join('\n'));process.exit(1)}
console.log(`Content valid. ${result.ambiguousAliases.length} ambiguous aliases retained.`);
