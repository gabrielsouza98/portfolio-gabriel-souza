const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const out = path.join(root, 'site');
fs.mkdirSync(out, { recursive: true });
let html = fs.readFileSync(path.join(root, 'editar.html'), 'utf8');
const version = require('node:crypto').createHash('sha256').update(fs.readFileSync(path.join(root, 'interacoes.js'))).digest('hex').slice(0, 12);
html = html.replace(/interacoes\.js(?:\?[^"']*)?/g, 'interacoes.js?v=' + version);
html = html.replace(/(src|href)="\/(?!\/)/g, '$1="./');
fs.writeFileSync(path.join(out, 'index.html'), html);
for (const name of ['personalizar.css', 'interacoes.js', 'favicon.svg', 'fonts', 'assets']) {
  fs.cpSync(path.join(root, name), path.join(out, name), { recursive: true });
}
const cssDir = path.join(root, '_next', 'static', 'css');
const cssOut = path.join(out, '_next', 'static', 'css');
fs.mkdirSync(cssOut, {recursive:true});
for (const name of fs.readdirSync(cssDir)) {
  const css = fs.readFileSync(path.join(cssDir,name),'utf8').replace(/url\(\/?fonts\//g,'url(../../../fonts/');
  fs.writeFileSync(path.join(cssOut,name),css);
}
fs.writeFileSync(path.join(out,'.nojekyll'),'');
console.log('Site preparado em site/. O conteúdo editável está em editar.html.');
