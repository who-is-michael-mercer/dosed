import { loadContent, validateContent } from './lib/content.mjs';

try {
  const result = validateContent(loadContent());
  if (result.errors.length > 0) {
    console.error(result.errors.join('\n'));
    process.exitCode = 1;
  } else {
    console.log(`Content valid. ${result.ambiguousAliases.length} ambiguous aliases retained.`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
