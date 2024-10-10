import * as Minio from 'minio';

const minioClient = new Minio.Client({
  endPoint: '192.168.86.100', // e.g., 'play.min.io'
  port: 9000, // e.g., 9000
  useSSL: false, // Set to false if not using SSL
  accessKey: process.env.MINIO_A!,
  secretKey: process.env.MINIO_S!
});

export async function getFromMinio<T>(
  bucketName: string,
  objectName: string,
  isJson: boolean = true
): Promise<T> {
  try {
    const stream = await minioClient.getObject(bucketName, objectName);

    let data = '';
    stream.on('data', (chunk) => {
      data += chunk;
    });

    return new Promise((resolve, reject) => {
      stream.on('end', () => {
        try {
          // const jsonData = JSON.parse(data);
          // resolve(jsonData);
          resolve(isJson ? JSON.parse(data) : data);
        } catch (error) {
          reject(new Error('Error parsing JSON'));
        }
      });

      stream.on('error', (error) => {
        reject(error);
      });
    });
  } catch (error) {
    // @ts-ignore
    console.error(`Error retrieving object: ${error.message}`);
    throw error;
  }
}
