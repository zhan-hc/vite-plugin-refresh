import fs from 'node:fs';
import path from 'path';
import { Plugin } from 'vite'
export default function refreshPlugin (packPath, projectName = 'refreshProject'): Plugin {
  // 生成的版本号
  let version: null | number = null;
  // 打包路径
  const distPath = packPath;
  // html路径
  const indexPath = path.join(distPath, 'index.html');
  // 版本号js文件路径
  const verFilePath = path.join(distPath, 'ver.js');
  return {
    name: 'vite:refresh',
    generateBundle() {
      
      version = Math.round(+new Date()/1000)
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
        (() => {
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
        })()
      </script>
      `
      return html.slice(0, insertIndex) + insertContent + html.slice(insertIndex)
    },
    writeBundle() {
      // 复制html
      const verstr = fs.readFileSync(verFilePath, 'utf-8')
      const version = (verstr.match(/\d/g) as RegExpExecArray).join('')
      const versionedIndexPath = path.join(distPath, `${version}.html`);
      fs.copyFileSync(indexPath, versionedIndexPath);
    }
  }
}
module.exports = refreshPlugin
refreshPlugin['default'] = refreshPlugin