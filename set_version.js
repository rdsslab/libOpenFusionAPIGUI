// bump-version.js
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const packagePath = path.resolve('package.json');
const versionFilePath = path.resolve('./src/lib/OpenFusionAPI/version.js');

// Leer package.json
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Validar antes de tocar nada: si la versión no es semver de 3 partes (o trae un
// sufijo tipo -beta.1) `Number` devuelve NaN y el bump escribiría un "9.5.NaN".
// Fallar acá es mejor que dejar el manifest corrupto.
const version = packageData.version || '0.0.0';
const parts = version.split('.').map(Number);

if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
	console.error(`Versión inválida en package.json: "${version}". Se esperaba semver (x.y.z).`);
	process.exit(1);
}

// El bump lo hace npm y no una sustitución de texto a mano, porque package-lock.json
// tiene su propia copia de la versión (la raíz y la entrada "" de `packages`): tocar
// solo el manifest dejaba el lock diciendo otra cosa en cada build. `npm version`
// actualiza los dos en la misma operación y preserva la indentación del lock, así que
// tampoco genera diff de formato -- que es lo que rompía `npm run lint`.
//
// El impacto de esa desalineación era cosmético, no funcional: `npm ci` valida las
// dependencias, no el campo "version" de la raíz, y el lock no se publica (el campo
// "files" de package.json es solo ["dist"]). O sea que esto mantiene la metadata
// coherente, no evita un fallo.
//
// --no-git-tag-version porque el bump es parte del build, no un release: este repo no
// versiona por tags.
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
execFileSync(npm, ['version', 'patch', '--no-git-tag-version'], { stdio: 'inherit' });

// npm ya dejó la versión nueva en package.json: leerla de ahí en vez de recalcularla.
const newVersion = JSON.parse(fs.readFileSync(packagePath, 'utf8')).version;

// Asegurarse que la carpeta existe
fs.mkdirSync(path.dirname(versionFilePath), { recursive: true });

// Crear version.js
fs.writeFileSync(versionFilePath, `export const version = '${newVersion}';\n`, 'utf8');

console.log(`Versión actualizada a ${newVersion}`);
