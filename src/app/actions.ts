'use server';

import type {DataItem, LocalizedContent} from '@/lib/data';
import {pavlodarData} from '@/lib/data';
import type {Language} from '@/lib/i18n';
import {uiTexts} from '@/lib/i18n';

// When building for static export (like GitHub Pages), Server Actions are not supported directly.
// We add a check to bypass the AI calls during the build process on GitHub Actions.
const isStaticExportBuild = process.env.GITHUB_ACTIONS === 'true';

export async function searchAction(query: string, lang: Language): Promise<DataItem[]> {
  const q = normalize(query);
  if (!q) return [];

  const scored = pavlodarData.map(item => {
    const loc = item[lang];
    const name = normalize(loc.name);
    const tags = loc.tags.map(normalize);
    const description = normalize(loc.description);
    const knowledge = normalize(loc.knowledge);

    const nameWords = tokenize(name);
    const tagWords = tags.flatMap(tokenize);
    const descWords = tokenize(description);
    const knowledgeWords = tokenize(knowledge);

    const nameStems = nameWords.map(w => stem(w, lang));
    const tagStems = tagWords.map(w => stem(w, lang));
    const descStems = descWords.map(w => stem(w, lang));
    const knowledgeStems = knowledgeWords.map(w => stem(w, lang));

    const corpusTokens = new Set<string>([
      ...nameStems,
      ...tagStems,
      ...descStems,
      ...knowledgeStems,
    ]);

    const queryTokensArr = tokenize(q);
    const queryStemArr = queryTokensArr.map(w => stem(w, lang));
    const queryTokens = new Set<string>(queryStemArr);

    const jaccard = jaccardSimilarity(queryTokens, corpusTokens);
    const nameExact = queryStemArr.reduce((acc, t) => acc + (nameStems.includes(t) ? 1 : 0), 0);
    const namePartial = queryStemArr.reduce((acc, t) => acc + (nameStems.some(w => w.startsWith(t) || t.startsWith(w)) ? 1 : 0), 0);
    const tagExact = queryStemArr.reduce((acc, t) => acc + (tagStems.includes(t) ? 1 : 0), 0);
    const tagPartial = queryStemArr.reduce((acc, t) => acc + (tagStems.some(w => w.startsWith(t) || t.startsWith(w)) ? 1 : 0), 0);
    const descPartial = queryStemArr.reduce((acc, t) => acc + (descStems.some(w => w.startsWith(t) || t.startsWith(w)) ? 1 : 0), 0);
    const knowledgePartial = queryStemArr.reduce((acc, t) => acc + (knowledgeStems.some(w => w.startsWith(t) || t.startsWith(w)) ? 1 : 0), 0);
    const lev = 1 - normalizedLevenshtein(q, name);

    const score =
      jaccard * 3 +
      nameExact * 3 +
      namePartial * 2.5 +
      tagExact * 2 +
      tagPartial * 1.5 +
      descPartial * 1 +
      knowledgePartial * 0.5 +
      lev * 1.5;

    return { item, score };
  })
  .filter(s => {
    const tokenCount = tokenize(q).length;
    const threshold = tokenCount <= 2 ? 0.2 : 0.5;
    return s.score >= threshold;
  })
  .sort((a, b) => b.score - a.score)
  .map(s => s.item);

  return scored;
}

export async function expandAction(
  item: LocalizedContent,
  userInput: string,
  lang: Language
): Promise<string> {
  const texts = uiTexts[lang];
  const q = normalize(userInput);
  if (!q) {
    return texts.aiInitialMessage;
  }

  const knowledge = item.knowledge;
  const knowledgeNorm = normalize(knowledge);
  const tokens = tokenize(q);

  const lines = knowledge.split('\n');
  const matched: string[] = [];
  for (const line of lines) {
    const ln = normalize(line);
    if (tokens.some(t => t && ln.includes(t))) {
      matched.push(line);
    }
  }

  if (matched.length === 0) {
    return 'у меня нет доступа к такой информации';
  }

  return matched.join('\n');
}

function normalize(s: string): string {
  return (s || '')
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(s: string): string[] {
  return s.split(' ').filter(Boolean);
}

function stem(word: string, lang: Language): string {
  if (!word) return '';
  if (lang === 'ru') return stemRu(word);
  return word;
}

function stemRu(word: string): string {
  let w = word;
  // remove common punctuation already done in normalize
  // strip trailing soft sign or vowels repeatedly to reach a stable core
  const vowels = new Set(['а','е','ё','и','о','у','ы','э','ю','я']);
  // remove frequent case endings
  const suffixes = ['ями','ями','ами','ами','ией','ией','ией','ов','ев','ёв','ами','ями','ем','ам','ом','ям','ям','ой','ей','ий','ый','ых','их','ою','ею','ую','ью','ия','ия','ая','яя'];
  for (const suf of suffixes) {
    if (w.endsWith(suf) && w.length > suf.length + 2) {
      w = w.slice(0, -suf.length);
      break;
    }
  }
  while (w.length > 3) {
    const last = w[w.length - 1];
    if (last === 'ь' || last === 'й' || vowels.has(last)) {
      w = w.slice(0, -1);
    } else {
      break;
    }
  }
  return w;
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let inter = 0;
  for (const t of a) {
    if (b.has(t)) inter++;
  }
  const union = a.size + b.size - inter;
  return inter / union;
}

function normalizedLevenshtein(a: string, b: string): number {
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length) || 1;
  return dist / maxLen;
}

function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[m][n];
}
