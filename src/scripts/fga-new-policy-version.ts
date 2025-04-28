import { fga } from '@/lib/fga/client';
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

async function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

async function bumpTermsVersion() {
  const currentPolicyPath = path.join(process.cwd(), 'src/lib/fga/policy_versions.ts');

  // Read the current policy_versions.ts
  const content = await fs.readFile(currentPolicyPath, 'utf-8');

  const match = content.match(/export const FINANCIAL_TERMS_VERSION = '(.*?)';/);

  if (!match) {
    console.error('❌ Could not find FINANCIAL_TERMS_VERSION in policy_versions.ts');
    process.exit(1);
  }

  const currentVersion = match[1];
  console.log(`🔎 Current Financial Terms version: ${currentVersion}`);

  const newVersionInput = await ask('👉 Enter the new Terms version (e.g., terms_v2.6): ');
  const newVersion = newVersionInput.startsWith('terms_') ? newVersionInput : `terms_${newVersionInput}`;

  console.log(`🚀 Upgrading Terms to: ${newVersion}`);

  // Update constants
  const updatedContent = content
    .replace(currentVersion, newVersion)
    .replace(`Financial Terms ${currentVersion.split('_')[1]}`, `Financial Terms ${newVersion.split('_')[1]}`);

  await fs.writeFile(currentPolicyPath, updatedContent);

  console.log('✅ Updated policy_versions.ts with new Terms version');

  const newPolicyObject = `policy:${newVersion}`;

  // Seed the new visible_with_terms tuples
  await fga.write({
    writes: [
      {
        user: `${newPolicyObject}#accepted`,
        relation: 'visible_with_terms',
        object: 'doc:retirement-advanced',
      },
      {
        user: `${newPolicyObject}#accepted`,
        relation: 'visible_with_terms',
        object: 'doc:zeko-competitive-summary',
      },
    ],
  });

  console.log('✅ Seeded new visible_with_terms relationships for new Terms version');
  console.log('🎉 Terms version bump complete!');
}

bumpTermsVersion().catch((err) => {
  console.error('❌ Failed to bump Terms version:', err);
  process.exit(1);
});
