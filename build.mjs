import esbuild from 'esbuild'
import archiver from 'archiver'
import fs from 'fs'

const outdir = 'build'

async function deleteOldDir() {
  fs.rmSync(outdir, {recursive: true, force: true})
}

async function runEsbuild() {
  await esbuild.build({
    entryPoints: [
      'src/content-script/index.mjs',
      'src/background/index.mjs'
    ],
    bundle: true,
    outdir: outdir
  })
}

async function zipFiles(entryPoints, outfile) {
  const output = fs.createWriteStream(outfile)
  const archive = archiver('zip', {
    zlib: {level: 9}
  })
  archive.pipe(output)
  for (const entryPoint of entryPoints) {
    archive.file(entryPoint.src, {name: entryPoint.dst})
  }
  await archive.finalize()
}

async function build() {
  await deleteOldDir()
  await runEsbuild()

  // chromium
  await zipFiles([
      {src: 'build/content-script/index.js', dst: 'content-script/index.js'},
      {src: 'build/background/index.js', dst: 'background/index.js'},
      {src: 'src/manifest.json', dst: 'manifest.json'},
      {src: 'src/styles.css', dst: 'styles.css'},
      {src: 'src/logo.png', dst: 'logo.png'}
    ],
    `./${outdir}/chromium.zip`)

  // firefox
  await zipFiles([
      {src: 'build/content-script/index.js', dst: 'content-script/index.js'},
      {src: 'build/background/index.js', dst: 'background/index.js'},
      {src: 'src/manifest.v2.json', dst: 'manifest.json'},
      {src: 'src/styles.css', dst: 'styles.css'},
      {src: 'src/logo.png', dst: 'logo.png'}
    ],
    `./${outdir}/firefox.zip`)
}

build()