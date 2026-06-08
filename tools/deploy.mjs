/**
 * One-command deploy for the pre-built (static) Vercel setup.
 *
 *   npm run deploy            -> rebuild + commit + push with a default message
 *   npm run deploy "message"  -> use a custom commit message
 *
 * What it does:
 *   1. Regenerates llms.txt
 *   2. Runs `vite build` — which re-discovers every horse + blog post and
 *      prerenders all routes, and regenerates sitemap.xml
 *   3. Stages the build output (dist/ + sitemap.xml + llms.txt)
 *   4. Commits + pushes ONLY if the build actually changed something
 *
 * Source/config edits are intentionally NOT auto-committed — commit those
 * yourself so deploys stay focused on rebuilt output.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';

function run(cmd) {
  console.log(`\n> ${cmd}`);
  execSync(cmd, { stdio: 'inherit' });
}

function hasStagedChanges() {
  try {
    // exits non-zero when there ARE staged changes
    execSync('git diff --cached --quiet');
    return false;
  } catch {
    return true;
  }
}

const message = process.argv[2] || `chore: rebuild prerendered dist (${new Date().toISOString().split('T')[0]})`;

// 1 + 2: build (generate-llms then vite build)
run('node tools/generate-llms.js');
run('npx vite build');

// 3: stage build artifacts that exist
const artifacts = ['dist', 'public/sitemap.xml', 'public/llms.txt'].filter((p) => fs.existsSync(p));
run(`git add ${artifacts.join(' ')}`);

// 4: commit + push only if something changed
if (!hasStagedChanges()) {
  console.log('\nNo build changes to deploy — working tree already up to date.');
  process.exit(0);
}

run(`git commit -m "${message.replace(/"/g, '\\"')}"`);
run('git push origin main');

console.log('\n✅ Deployed. Vercel will pick up the push and serve the new dist/.');
