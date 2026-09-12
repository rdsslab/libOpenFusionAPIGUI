// scripts/verify-deps.js
// Verifica la trazabilidad de las dependencias instaladas desde repositorio git.
//
// Politica: @rdsslab/uFetch se actualiza desde main ("siempre la version mas
// reciente"), por lo que la dependencia es una URL flotante. Para no perder el
// control se exige:
//   1. package-lock.json committed (el lockfile fija el commit resuelto).
//   2. El commit resuelto de @rdsslab/uFetch debe estar registrado en
//      uFetch.lock.json. Si cambia sin registrarse, el build falla.
//
// Uso:
//   npm run verify:deps            -> comprueba que el commit resuelto coincide
//   npm run verify:deps -- --register   -> registra el commit actual como baseline
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const lockPath = path.join(root, 'package-lock.json');
const pkgPath = path.join(root, 'package.json');
const ufetchLockPath = path.join(root, 'uFetch.lock.json');
const ufetchDir = path.join(root, 'node_modules', '@rdsslab', 'uFetch');
const SPEC = '@rdsslab/uFetch';

if (!fs.existsSync(lockPath)) {
  console.error(
    '[verify-deps] ERROR: package-lock.json no existe. Commitea el lockfile ' +
      '(ya no esta en .gitignore) y ejecuta `npm install` para generarlo.'
  );
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const depSpec = pkg.dependencies?.[SPEC];
if (!depSpec) {
  console.error(`[verify-deps] ERROR: la dependencia ${SPEC} no esta declarada.`);
  process.exit(1);
}

const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const lockEntry = lock.packages?.[`node_modules/${SPEC}`];
const lockVersion = lockEntry?.version ?? null;
const lockResolved = lockEntry?.resolved ?? null;

let commit = null;
if (lockResolved) {
  const m = lockResolved.match(/commit\/([0-9a-f]{40})/) || lockResolved.match(/#([0-9a-f]{40})$/);
  if (m) commit = m[1];
}

let installedVersion = null;
if (fs.existsSync(path.join(ufetchDir, 'package.json'))) {
  try {
    installedVersion = JSON.parse(fs.readFileSync(path.join(ufetchDir, 'package.json'), 'utf8')).version;
  } catch {
    installedVersion = null;
  }
}

const record = {
  spec: depSpec,
  lockVersion,
  lockResolved,
  commit,
  installedVersion,
};

if (process.argv.includes('--register')) {
  fs.writeFileSync(ufetchLockPath, JSON.stringify(record, null, 2) + '\n', 'utf8');
  console.log(`[verify-deps] baseline registrado en ${ufetchLockPath}`);
  console.log(JSON.stringify(record, null, 2));
  process.exit(0);
}

let base = null;
if (fs.existsSync(ufetchLockPath)) {
  try {
    base = JSON.parse(fs.readFileSync(ufetchLockPath, 'utf8'));
  } catch {
    base = null;
  }
}

if (base?.commit && base.commit !== commit) {
  console.error(
    `[verify-deps] ERROR: el commit resuelto de ${SPEC} cambio de ${base.commit} a ${commit} ` +
      `sin registro. Si el cambio es intencional, ejecuta: npm run verify:deps -- --register`
  );
  process.exit(1);
}

if (!commit && base?.commit) {
  console.error(
    `[verify-deps] ERROR: no se pudo resolver un commit para ${SPEC} en el lockfile (${lockResolved}).`
  );
  process.exit(1);
}

console.log(`[verify-deps] OK ${SPEC}`);
console.log(JSON.stringify(record, null, 2));