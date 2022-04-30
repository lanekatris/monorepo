import styles from './score-card-image.module.css';
import Image from 'next/image';

export interface ScoreCardImageProps {
  fileNames: string[]
}

export function ScoreCardImage({fileNames}: ScoreCardImageProps) {
  return <div className="text-center">
    {fileNames.map(fileName => <Image src={`https://dvg45c871tdz4.cloudfront.net/disc-golf-images/${fileName}.jpg`} width="231" height="150.3"/>)}
  </div>

}

export default ScoreCardImage;
