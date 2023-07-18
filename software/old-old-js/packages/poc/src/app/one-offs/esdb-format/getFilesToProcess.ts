const fs = require('fs');

export function getFilesToProcess(dataDir: string) {
  const result = fs.readdirSync(dataDir);
  return result.map((x) => `${dataDir}\\${x}`);
}
