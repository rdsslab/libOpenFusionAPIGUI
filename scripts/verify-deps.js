// scripts/verify-deps.js
// Verifica la trazabilidad de las dependencias instaladas desde repositorio git.
//
// Politica: @rdsslab/uFetch se actualiza desde main ("siempre la version mas
// reciente", URL flotante) y @rdsslab/svelte-components puede apuntar a un
// commit concreto (URL pinned). Para no perder el control se exige:
//   1. package-lock.json committed (el lockfile fija el commit resuelto).
//   2. El commit resuelto de cada dependencia debe estar registrado en su
//      baseline (<paquete>.lock.json). Si cambia sin registrarse, el build
//      falla (evita pins desactualizados o bumps silenciosos).
//
// Uso:
//   npm run verify:deps            -> comprueba que el commit resuelto coincide
//   npm run verify:deps -- --register   -> registra el commit actual como baseline
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('.');
const lockPath = path.join(root, 'package-lock.json');
const pkgPath = path.join(root, 'package.json');

const SPECS = [
  { name: '@rdsslab/uFetch', lockFile: 'uFetch.lock.json' },
  { name: '@rdsslab/svelte-components', lockFile: 'svelte-components.lock.json' },
];

if (!fs.existsSync(lockPath)) {
  console.error(
    '[verify-deps] ERROR: package-lock.json no existe. Commitea el lockfile ' +
      '(ya no esta en .gitignore) y ejecuta `npm install` para generarlo.'
  );
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));

let failed = false;

for (const spec of SPECS) {
  const depSpec = pkg.dependencies?.[spec.name];
  if (!depSpec) {
    console.error(`[verify-deps] ERROR: la dependencia ${spec.name} no esta declarada.`);
    process.exit(1);
  }

  const lockEntry = lock.packages?.[`node_modules/${spec.name}`];
  const lockVersion = lockEntry?.version ?? null;
  const lockResolved = lockEntry?.resolved ?? null;

  let commit = null;
  if (lockResolved) {
    const m = lockResolved.match(/commit\/([0-9a-f]{40})/) || lockResolved.match(/#([0-9a-f]{40})$/);
    if (m) commit = m[1];
  }

  const dir = path.join(root, 'node_modules', spec.name);
  let installedVersion = null;
  if (fs.existsSync(path.join(dir, 'package.json'))) {
    try {
      installedVersion = JSON.parse(
        fs.readFileSync(path.join(dir, 'package.json'), 'utf8')
      ).version;
    } catch {
      installedVersion = null;
    }
  }

  const record = { spec: depSpec, lockVersion, lockResolved, commit, installedVersion };
  const baselinePath = path.join(root, spec.lockFile);

  if (process.argv.includes('--register')) {
    fs.writeFileSync(baselinePath, JSON.stringify(record, null, 2) + '\n', 'utf8');
    console.log(`[verify-deps] baseline registrado en ${spec.lockFile}`);
    console.log(JSON.stringify(record, null, 2));
    continue;
  }

  let base = null;
  if (fs.existsSync(baselinePath)) {
    try {
      base = JSON.parse(fs.readFileSync(baselinePath, 'utf8'));
    } catch {
      base = null;
    }
  }

  if (base?.commit && base.commit !== commit) {
    console.error(
      `[verify-deps] ERROR: el commit resuelto de ${spec.name} cambio de ` +
        `${base.commit} a ${commit} sin registro. Si el cambio es intencional, ` +
        `ejecuta: npm run verify:deps -- --register`
    );
    failed = true;
  }

  if (!commit && base?.commit) {
    console.error(
      `[verify-deps] ERROR: no se pudo resolver un commit para ${spec.name} en ` +
        `el lockfile (${lockResolved}).`
    );
    failed = true;
  }

  if (!failed) {
    console.log(`[verify-deps] OK ${spec.name}`);
    console.log(JSON.stringify(record, null, 2));
  }
}

if (failed) process.exit(1);