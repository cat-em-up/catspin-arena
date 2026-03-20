import fg from 'fast-glob';
import fs from 'node:fs/promises';
import path from 'node:path';
import ts from 'typescript';

const OUT_FILE = 'docs/STRUCTURE.md';

const IGNORE = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/coverage/**',
  '**/.git/**',
  '**/*.d.ts',
  '**/*.test.ts',
  '**/*.spec.ts',
];

function isExported(node) {
  const mods = node.modifiers;
  if (!mods) {
    return false;
  }
  return mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
}

function getFileDocComment(sourceText) {
  const ranges = ts.getLeadingCommentRanges(sourceText, 0);
  if (!ranges || !ranges.length) {
    return null;
  }

  const r = ranges[0];
  const raw = sourceText.slice(r.pos, r.end);

  if (raw.startsWith('/*')) {
    const cleaned = cleanBlockCommentText(raw);
    return cleaned ? normalizeSpaces(cleaned) : null;
  }

  if (raw.startsWith('//')) {
    const lines = raw
      .split(/\r?\n/)
      .map((l) => cleanLineCommentText(l))
      .filter(Boolean);

    if (lines.length) {
      return normalizeSpaces(lines.join(' '));
    }
  }

  return null;
}

function getParamsText(params) {
  return params
    .map((p) => {
      if (ts.isIdentifier(p.name)) {
        return p.name.text;
      }
      return p.name.getText();
    })
    .join(', ');
}

function addUnique(arr, item, keyFn = (x) => x) {
  if (!item) {
    return;
  }
  const key = keyFn(item);
  if (!arr.some((x) => keyFn(x) === key)) {
    arr.push(item);
  }
}

function normalizeSpaces(s) {
  return String(s).replace(/\s+/g, ' ').trim();
}

function cleanBlockCommentText(raw) {
  if (!raw) {
    return null;
  }
  const s = String(raw)
    .replace(/^\/\*\*?/, '')
    .replace(/\*\/$/, '')
    .replace(/^\s*\*\s?/gm, '')
    .trim();
  return s || null;
}

function cleanLineCommentText(raw) {
  if (!raw) {
    return null;
  }
  const s = String(raw).replace(/^\/\//, '').trim();
  return s || null;
}

function firstMeaningfulLine(text) {
  if (!text) {
    return null;
  }
  const line = String(text)
    .split(/\r?\n/)
    .map((x) => x.trim())
    .find(Boolean);
  return line ? normalizeSpaces(line) : null;
}

function getJsDocFromNode(node, sourceText) {
  const list = node.jsDoc;
  if (!list || !list.length) {
    return null;
  }

  const jd = list[list.length - 1];
  const raw = sourceText.slice(jd.pos, jd.end);
  const cleaned = cleanBlockCommentText(raw);
  const first = firstMeaningfulLine(cleaned);
  return first || null;
}

function getDeclDocOneLiner(node, sourceFile, sourceText) {
  const jsDocLine = getJsDocFromNode(node, sourceText);
  if (jsDocLine) {
    return jsDocLine;
  }

  const start = node.getFullStart ? node.getFullStart() : node.pos;
  const ranges = ts.getLeadingCommentRanges(sourceText, start) || [];
  if (!ranges.length) {
    return null;
  }

  for (let i = ranges.length - 1; i >= 0; i--) {
    const r = ranges[i];
    const raw = sourceText.slice(r.pos, r.end);

    if (raw.startsWith('/*')) {
      const cleaned = cleanBlockCommentText(raw);
      const first = firstMeaningfulLine(cleaned);
      if (first) {
        return first;
      }
    }

    if (raw.startsWith('//')) {
      let merged = raw;

      for (let j = i - 1; j >= 0; j--) {
        const prev = ranges[j];
        const prevRaw = sourceText.slice(prev.pos, prev.end);
        if (!prevRaw.startsWith('//')) {
          break;
        }
        merged = `${prevRaw}\n${merged}`;
        i = j;
      }

      const lines = merged
        .split(/\r?\n/)
        .map((l) => cleanLineCommentText(l))
        .filter(Boolean);

      if (lines.length) {
        return normalizeSpaces(lines.join(' '));
      }
    }
  }

  return null;
}

function fmtItemLine(nameOrSig, comment) {
  if (!comment) {
    return `- ${nameOrSig}`;
  }
  return `- ${nameOrSig} — ${comment}`;
}

function extractTopLevelDecls(sourceFile, sourceText) {
  const out = {
    classes: [],
    exportedFunctions: [],
    internalFunctions: [],
    types: [],
  };

  for (const st of sourceFile.statements) {
    if (ts.isClassDeclaration(st) && st.name?.text) {
      const name = st.name.text;
      const comment = getDeclDocOneLiner(st, sourceFile, sourceText);
      addUnique(out.classes, { name, comment }, (x) => x.name);
      continue;
    }

    if (ts.isTypeAliasDeclaration(st) && st.name?.text) {
      const name = st.name.text;
      const comment = getDeclDocOneLiner(st, sourceFile, sourceText);
      addUnique(out.types, { name, comment }, (x) => x.name);
      continue;
    }

    if (ts.isFunctionDeclaration(st) && st.name?.text) {
      const sig = `${st.name.text}(${getParamsText(st.parameters)})`;
      const comment = getDeclDocOneLiner(st, sourceFile, sourceText);
      const item = { sig, comment };

      if (isExported(st)) {
        addUnique(out.exportedFunctions, item, (x) => x.sig);
      } else {
        addUnique(out.internalFunctions, item, (x) => x.sig);
      }
      continue;
    }

    if (ts.isVariableStatement(st)) {
      const exported = isExported(st);
      const stComment = getDeclDocOneLiner(st, sourceFile, sourceText);

      for (const decl of st.declarationList.declarations) {
        if (!ts.isIdentifier(decl.name)) {
          continue;
        }

        const name = decl.name.text;
        const init = decl.initializer;
        if (!init) {
          continue;
        }

        if (ts.isArrowFunction(init) || ts.isFunctionExpression(init)) {
          const sig = `${name}(${getParamsText(init.parameters)})`;

          const comment =
            getDeclDocOneLiner(decl, sourceFile, sourceText) ??
            stComment ??
            getDeclDocOneLiner(init, sourceFile, sourceText);

          const item = { sig, comment };

          if (exported) {
            addUnique(out.exportedFunctions, item, (x) => x.sig);
          } else {
            addUnique(out.internalFunctions, item, (x) => x.sig);
          }
        }
      }
    }
  }

  out.classes.sort((a, b) => a.name.localeCompare(b.name));
  out.types.sort((a, b) => a.name.localeCompare(b.name));
  out.exportedFunctions.sort((a, b) => a.sig.localeCompare(b.sig));
  out.internalFunctions.sort((a, b) => a.sig.localeCompare(b.sig));

  return out;
}

function buildTree(pathsList) {
  const root = {};

  for (const p of pathsList) {
    const parts = p.split('/').filter(Boolean);
    let node = root;
    for (const part of parts) {
      node[part] ??= {};
      node = node[part];
    }
  }

  function render(node, prefix = '') {
    const entries = Object.keys(node).sort((a, b) => {
      const aIsFile = a.endsWith('.ts');
      const bIsFile = b.endsWith('.ts');
      if (aIsFile !== bIsFile) {
        return aIsFile ? 1 : -1;
      }
      return a.localeCompare(b);
    });

    const lines = [];
    for (let i = 0; i < entries.length; i++) {
      const key = entries[i];
      const isLast = i === entries.length - 1;
      const branch = isLast ? '└─ ' : '├─ ';
      lines.push(prefix + branch + key);

      const child = node[key];
      const hasChildren = child && Object.keys(child).length > 0;
      if (hasChildren) {
        lines.push(...render(child, prefix + (isLast ? '   ' : '│  ')));
      }
    }
    return lines;
  }

  return render(root).join('\n');
}

function pushSection(sections, title, items, renderFn) {
  if (!items.length) {
    return;
  }
  sections.push(title);
  sections.push(...items.map(renderFn));
  sections.push('');
}

async function main() {
  const cwd = process.cwd();

  const files = await fg(['**/*.ts'], {
    cwd,
    ignore: IGNORE,
    dot: false,
    onlyFiles: true,
    unique: true,
  });

  files.sort();

  const tree = buildTree(files);

  const sections = [];
  sections.push('# Project Structure\n');
  sections.push('## File Tree\n');
  sections.push('```');
  sections.push(tree || '(no .ts files found)');
  sections.push('```');
  sections.push('\n## File Index\n');

  for (const rel of files) {
    const abs = path.join(cwd, rel);
    const code = await fs.readFile(abs, 'utf8');

    const sf = ts.createSourceFile(rel, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);

    const fileComment = getFileDocComment(code);

    const d = extractTopLevelDecls(sf, code);

    sections.push(`### ${rel}\n`);

    if (fileComment) {
      sections.push(fileComment);
      sections.push('');
    }

    pushSection(sections, 'Classes:', d.classes, (x) => fmtItemLine(x.name, x.comment));

    pushSection(sections, 'Exported Functions:', d.exportedFunctions, (x) => fmtItemLine(x.sig, x.comment));

    pushSection(sections, 'Internal Functions:', d.internalFunctions, (x) => fmtItemLine(x.sig, x.comment));

    pushSection(sections, 'Types:', d.types, (x) => fmtItemLine(x.name, x.comment));
  }

  await fs.mkdir(path.dirname(path.join(cwd, OUT_FILE)), { recursive: true });
  await fs.writeFile(path.join(cwd, OUT_FILE), sections.join('\n'), 'utf8');
  console.log(`OK: wrote ${OUT_FILE} (${files.length} files)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
