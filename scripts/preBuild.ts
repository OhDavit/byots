/**
 * Utils
 */
declare var process, require, __dirname;
var fs = require('fs');
export function readFile(filePath: string): string {
  return fs.readFileSync(__dirname + '/' + filePath, 'utf8');
}
export function writeFile(filePath: string, content: string) {
  fs.writeFileSync(__dirname + '/' + filePath, content);
}

/**
 * Fixes
 */
interface IFix {
  orig: string | RegExp;
  new: string;
}
interface IFixForFile {
  filePath: string,
  fixes: IFix[],
  additions?: string,
}
const fixesForFiles: IFixForFile[] = [
  {
    filePath: '../TypeScript/src/services/refactors/extractMethod.ts',
    fixes: [
      {
        orig: 'const enum Usage',
        new: 'export const enum Usage'
      }
    ]
  }
];

/**
 * Run the fixes
 */
fixesForFiles.forEach(fff => {
  let content = readFile(fff.filePath);
  content = content.split(/\r\n?|\n/).join('\n');
  fff.fixes.forEach(fix => {
    if (typeof fix.orig === 'string') {
      const orig = fix.orig.split(/\r\n?|\n/).join('\n').trim();
      if (content.indexOf(orig) === -1) {
        // OH OH . Fix no longer valid
        console.log('FIX ORIG NOT FOUND:', fff.filePath);
        console.log(fix)
        process.exit(1);
      }
      content = content.replace(orig, fix.new);
    }
    else {
      if (fix.orig.test(content) == null) {
        // OH OH . Fix no longer valid
        console.log('FIX ORIG NOT FOUND:', fff.filePath);
        console.log(fix)
        process.exit(1);
      }
      content = content.replace(fix.orig, fix.new);
    }
  })
  if (fff.additions) {
    content = content + fff.additions;
  }
  writeFile(fff.filePath, content);
})