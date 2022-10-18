export function streamToString(stream): Promise<string> {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

export function streamToBuffer(stream): Promise<Buffer> {
  const buff = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => buff.push(chunk));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(buff)));
  });
}
