const yaml = require('js-yaml');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const configPath = path.join(root, 'codeowners.yaml');
const outputPath = path.join(root, '.github', 'CODEOWNERS');

const config = yaml.load(fs.readFileSync(configPath, 'utf8'));

const lines = [
  '# This file is auto-generated from codeowners.yaml',
  '# Do not edit manually — run `npm run generate:codeowners` to regenerate',
  '',
];

for (const [teamName, team] of Object.entries(config.teams)) {
  const owners = team.owners.map((o) => o.github).join(' ');
  lines.push(`# ${teamName}`);
  for (const pattern of team.paths) {
    lines.push(`${pattern} ${owners}`);
  }
  lines.push('');
}

fs.writeFileSync(outputPath, lines.join('\n'));
console.log(`CODEOWNERS written to ${outputPath}`);
