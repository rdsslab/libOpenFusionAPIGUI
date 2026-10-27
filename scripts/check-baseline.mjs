#!/usr/bin/env node
/**
 * Ratchet de la deuda de tipos.
 *
 * Corre svelte-check y compara el número de errores con quality/baseline.json.
 * - Si el total SUBE: falla (no se aceptan errores nuevos).
 * - Si el total BAJA: avisa para que se actualice el baseline a mano.
 *
 * El baseline es deuda visible: nunca se usa para ocultar errores, solo para
 * impedir que crezca mientras se paga por fases.
 *
 * Uso:
 *   node scripts/check-baseline.mjs            # verifica
 *   node scripts/check-baseline.mjs --update   # fija el baseline actual
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const baselinePath = path.join(root, 'quality', 'baseline.json');
const update = process.argv.includes('--update');

function run(command) {
	const result = spawnSync(command, {
		cwd: root,
		shell: true,
		encoding: 'utf8',
		maxBuffer: 64 * 1024 * 1024
	});
	return { status: result.status ?? 1, stdout: result.stdout ?? '', stderr: result.stderr ?? '' };
}

const sync = run('npx svelte-kit sync');
if (sync.status !== 0) {
	process.stderr.write(sync.stderr || sync.stdout);
	console.error('\n[check:baseline] svelte-kit sync falló.');
	process.exit(1);
}

const check = run('npx svelte-check --tsconfig ./jsconfig.json --output machine');
const lines = check.stdout.split('\n');
const errors = lines.filter((line) => /^\d+ (ERROR|WARNING) "/.test(line));
const errorCount = lines.filter((line) => /^\d+ ERROR "/.test(line)).length;
const files = new Set(errors.map((line) => line.split('"')[1])).size;

if (errorCount === 0) {
	console.log('[check:baseline] 0 errores. La deuda está saldada: cambia el CI a `npm run check`.');
}

let baseline;
try {
	baseline = JSON.parse(readFileSync(baselinePath, 'utf8'));
} catch {
	console.error(`[check:baseline] No se pudo leer ${path.relative(root, baselinePath)}.`);
	process.exit(1);
}

if (update) {
	baseline.errors = errorCount;
	baseline.files = files;
	baseline.updated = new Date().toISOString().slice(0, 10);
	writeFileSync(baselinePath, JSON.stringify(baseline, null, '\t') + '\n');
	console.log(`[check:baseline] Baseline actualizado a ${errorCount} errores (${files} archivos).`);
	process.exit(0);
}

console.log(
	`[check:baseline] errores: ${errorCount} (baseline: ${baseline.errors}, archivos: ${files})`
);

if (errorCount > baseline.errors) {
	console.error(
		`\n[check:baseline] FALLO: ${errorCount - baseline.errors} error(es) nuevos. ` +
			'No se aceptan errores nuevos; corrige el código o el tipado (no suprimas el diagnóstico).'
	);
	process.exit(1);
}

if (errorCount < baseline.errors) {
	console.log(
		`\n[check:baseline] Mejora: ${baseline.errors - errorCount} error(es) menos. ` +
			'Ejecuta `npm run check:baseline -- --update` y commitea quality/baseline.json para fijar el avance.'
	);
}

process.exit(0);
