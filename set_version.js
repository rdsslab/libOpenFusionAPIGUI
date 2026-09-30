// bump-version.js
import fs from 'fs';
import path from 'path';

const packagePath = path.resolve('package.json');
const versionFilePath = path.resolve('./src/lib/OpenFusionAPI/version.js');

// Leer package.json
const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Obtener y dividir versión
let version = packageData.version || '0.0.0';
let parts = version.split('.').map(Number);

// Validar antes de tocar nada: si la versión no es semver de 3 partes (o trae un
// sufijo tipo -beta.1) `Number` devuelve NaN y el bump escribiría un "9.5.NaN".
// Fallar acá es mejor que dejar el package.json con una versión corrupta.
if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
	console.error(`Versión inválida en package.json: "${version}". Se esperaba semver (x.y.z).`);
	process.exit(1);
}

// Incrementar el último número (patch)
parts[2] = parts[2] + 1;
let newVersion = parts.join('.');

// Actualizar package.json.
//
// Se edita el texto crudo en vez de reserializar el JSON entero: `JSON.stringify`
// reescribía el archivo con 2 espacios y el repo usa tabs (`useTabs` en
// .prettierrc), así que cada build dejaba 77 líneas de diff de formato y
// `npm run lint` (que corre `prettier --check .`) fallaba. Sustituyendo solo el
// valor del campo, el resto del archivo queda byte a byte igual.
const rawPackage = fs.readFileSync(packagePath, 'utf8');
const versionField = /("version"\s*:\s*")[^"]*(")/;

if (!versionField.test(rawPackage)) {
	console.error('No se encontró el campo "version" en package.json. No se modificó el archivo.');
	process.exit(1);
}

const updatedPackage = rawPackage.replace(versionField, `$1${newVersion}$2`);

// Verificar que el reemplazo cayó en la versión del paquete y no en otro
// "version" anidado: si el JSON parsea y su versión es la esperada, es correcto.
if (JSON.parse(updatedPackage).version !== newVersion) {
	console.error('El reemplazo no actualizó packageData.version. No se modificó el archivo.');
	process.exit(1);
}

fs.writeFileSync(packagePath, updatedPackage, 'utf8');

// Asegurarse que la carpeta existe
fs.mkdirSync(path.dirname(versionFilePath), { recursive: true });

// Crear version.js
fs.writeFileSync(versionFilePath, `export const version = '${newVersion}';\n`, 'utf8');

console.log(`Versión actualizada a ${newVersion}`);
