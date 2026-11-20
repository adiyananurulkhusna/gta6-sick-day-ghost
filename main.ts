// Entry program for the gta6-meme-x-01 bounty (Node 22, standard library only).
// The entry is the X post itself: this program only copies POST.json from the
// repository root into the output directory, where the gate reads it to find
// the post. Nothing this program writes about the post is judged.
//
// POST.json holds the address of the posted meme; it is checked here before
// the copy, so a placeholder or broken file fails loudly instead of being
// submitted as-is.
//
// Run it the way the grader does:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

const source = join(BOT_DIR, 'POST.json');
const target = join(OUTPUT_DIR, 'POST.json');

let postUrl: unknown;
try {
  postUrl = JSON.parse(readFileSync(source, 'utf8')).url;
} catch (err) {
  console.error(`POST.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof postUrl !== 'string' || !postUrl.startsWith('https://')) {
  console.error(`POST.json does not hold a valid post address: ${String(postUrl)}`);
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(source, target);
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
console.log(`Copied POST.json for ${postUrl} to ${target}`);
