import * as Minio from 'minio';
import { BucketItemStat } from 'minio';

const minioClient = new Minio.Client({
  endPoint: 'server1', // e.g., 'play.min.io'
  port: 9000, // e.g., 9000
  useSSL: false, // Set to false if not using SSL
  accessKey: process.env.MINIO_A!,
  secretKey: process.env.MINIO_S!
});

export async function getFromMinio<T>(
  bucketName: string,
  objectName: string,
  isJson: boolean = true
): Promise<{
  data: T;
  stats: BucketItemStat;
}> {
  try {
    const stream = await minioClient.getObject(bucketName, objectName);
    const stats = await minioClient.statObject(bucketName, objectName);

    let data = '';
    stream.on('data', (chunk) => {
      data += chunk;
    });

    return new Promise((resolve, reject) => {
      stream.on('end', () => {
        try {
          resolve(isJson ? { data: JSON.parse(data), stats } : { data, stats });
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
