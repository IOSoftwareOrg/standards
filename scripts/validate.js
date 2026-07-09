const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

const root = path.join(__dirname, '..');

const jsonFiles = [
  'config/.eslintrc.json',
  'config/.prettierrc.json',
  'config/tsconfig.json',
  'templates/package.json',
];

const yamlFiles = [
  'ci/.github/workflows/test.yml',
  'ci/.github/workflows/deploy.yml',
];

let hasError = false;

for (const relPath of jsonFiles) {
  const fullPath = path.join(root, relPath);
  try {
    JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    console.log(`OK   ${relPath}`);
  } catch (e) {
    console.error(`FAIL ${relPath}: ${e.message}`);
    hasError = true;
  }
}

for (const relPath of yamlFiles) {
  const fullPath = path.join(root, relPath);
  try {
    YAML.parse(fs.readFileSync(fullPath, 'utf8'));
    console.log(`OK   ${relPath}`);
  } catch (e) {
    console.error(`FAIL ${relPath}: ${e.message}`);
    hasError = true;
  }
}

if (hasError) {
  console.error('\nValidation failed.');
  process.exitCode = 1;
} else {
  console.log('\nAll config files are valid.');
}
