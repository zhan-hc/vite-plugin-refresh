import fs from 'node:fs';
import path from 'path';
export default function refreshPlugin(packingPath = './dist', projectName = 'refreshProject') {
  let version: null | number = null;  
  return {
    name: 'vite:refresh',
    generateBundle() {
      const distPath = path.resolve(__dirname, packingPath);
      version = Math.round(+new Date()/1000)
      const verFilePath = path.join(distPath, 'ver.js');
        const writeFileSync = (version) => {
          fs.writeFileSync(verFilePath,
            `function getVersion() { return '${version}' }`, 'utf8')
        }

        if (!fs.existsSync(distPath)) {
          fs.mkdirSync(distPath);
        }
        writeFileSync(version);
    },
    transformIndexHtml(html) {
      const insertIndex = html.lastIndexOf('</title>') + 8
      const insertContent = `
      <script src="./ver.js?t=${+new Date()}"></script>
      <script>
        const version = getVersion();
        const latestPage = version + '.html';
        const pathnameArr = location.pathname.split('/');
        const len = pathnameArr.length;
        const currentPage = pathnameArr[len - 1];
        const cache = localStorage.getItem('${projectName}');
        const isIndex = currentPage === 'index.html';
        if (currentPage && isIndex && (!cache || cache === latestPage)) {
          localStorage.setItem('${projectName}', latestPage);
        } else if (currentPage && (latestPage !== currentPage)) {
          const dirctUrl = location.href.replace(currentPage, latestPage);
          window.location.replace(dirctUrl);
        }
      </script>
      `
      return html.slice(0, insertIndex) + insertContent + html.slice(insertIndex)
    },
    writeBundle() {
      const verstr = fs.readFileSync(path.join(__dirname, './dist/ver.js'), 'utf-8')
      const version = verstr.match(/\d/g).join('')
      const distPath = path.resolve(__dirname, packingPath);
      const indexPath = path.join(distPath, 'index.html');
      const versionedIndexPath = path.join(distPath, `${version}.html`);
      fs.copyFileSync(indexPath, versionedIndexPath);
    }
  }
}
