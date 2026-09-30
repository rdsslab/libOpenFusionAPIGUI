// bump-version.js
import fs from 'fs';
import path from 'path';

const packagePath = path.resolve('package.json');
const lockPath = path.resolve('package-lock.json');
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

// Sincronizar package-lock.json.
//
// El lock tiene su propia copia de la versión (la raíz y la entrada "" de `packages`),
// así que bumpear solo package.json lo deja desfasado en cada build: `npm ci` instala
// la versión del lock, no la del manifest. Se corrigen las dos con el mismo criterio
// que arriba -- reemplazo del texto crudo, sin reserializar -- porque el lock también
// va con tabs y un `JSON.stringify` lo reformatearía entero.
//
// Los dos campos se localizan por posición y no buscando el número de versión:
// cuando el lock ya está desfasado sus dos copias ni siquiera coinciden entre sí
// (una puede decir 9.4.5 y la otra 9.5.1) y una búsqueda por texto dejaría una sin
// tocar. El anclaje es que npm escribe la metadata de la raíz primero, y que
// `packages` arranca con la entrada "".
if (fs.existsSync(lockPath)) {
	const rawLock = fs.readFileSync(lockPath, 'utf8');

	// 1) la "version" de primer nivel (la raíz del lock)
	const rootField = /("version"\s*:\s*")[^"]*(")/;
	// 2) la "version" dentro de la entrada "" de `packages`
	const emptyEntryField = /("packages"\s*:\s*\{\s*""\s*:\s*\{[\s\S]*?)("version"\s*:\s*")[^"]*(")/;

	let updatedLock = rawLock;
	if (rootField.test(updatedLock)) {
		updatedLock = updatedLock.replace(rootField, `$1${newVersion}$2`);
	}
	if (emptyEntryField.test(updatedLock)) {
		// El match completo es `pre` + `head` + versión + `tail`: se reassamblea todo
		// igual y solo se cambia el número de versión.
		updatedLock = updatedLock.replace(
			emptyEntryField,
			(_, pre, head, tail) => pre + head + newVersion + tail
		);
	}

	// Si el lock quedara con JSON inválido no se aborta el build: se avisa y sigue,
	// porque el bump de package.json ya se aplicó y el lock se regenera con
	// `npm install --package-lock-only`.
	let lockOk = false;
	try {
		const parsedLock = JSON.parse(updatedLock);
		const lockRootOk = parsedLock.version === newVersion;
		const lockEntryOk = parsedLock.packages?.['']?.version === newVersion;

		// Ninguna dependencia puede haber cambiado: salvo la entrada "", `packages`
		// tiene que quedar idéntico. Si no, no se escribe el lock.
		const depsIntact =
			JSON.stringify({ ...parsedLock.packages, '': null }) ===
			JSON.stringify({ ...JSON.parse(rawLock).packages, '': null });

		if (lockRootOk && lockEntryOk && depsIntact) {
			fs.writeFileSync(lockPath, updatedLock, 'utf8');
			lockOk = true;
		}
	} catch {
		// Se deja el lock como estaba.
	}

	if (!lockOk) {
		console.warn(
			`Aviso: no se pudo sincronizar package-lock.json a ${newVersion}. ` +
				`Ejecutá "npm install --package-lock-only" para regenerarlo.`
		);
	}
} else {
	console.warn('Aviso: no se encontró package-lock.json; solo se actualizó package.json.');
}

// Asegurarse que la carpeta existe
fs.mkdirSync(path.dirname(versionFilePath), { recursive: true });

// Crear version.js
fs.writeFileSync(versionFilePath, `export const version = '${newVersion}';\n`, 'utf8');

console.log(`Versión actualizada a ${newVersion}`);
