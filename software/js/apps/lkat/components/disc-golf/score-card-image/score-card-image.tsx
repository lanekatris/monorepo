import Image from 'next/image';

export interface ScoreCardImageProps {
  fileNames: string[];
}

export function ScoreCardImage({ cards }: ScoreCardImageProps) {
  return (
    <div className="text-center grid gap-2 grid-cols-1 sm:grid-cols-2 my-2 w-full justify-center items-center">
      {cards.map(({ imageName, courseUrl }) => (
        <div key={imageName} className="flex flex-col justify-center">
          <a
            className="flex-1"
            href={`https://dvg45c871tdz4.cloudfront.net/disc-golf-images/${imageName}.jpg`}
            target="_blank"
            rel="noreferrer"
          >
            <Image
              src={`https://dvg45c871tdz4.cloudfront.net/disc-golf-images/${imageName}.jpg`}
              width="231"
              height="150.3"
              alt={imageName}
            />
          </a>

          <a className="flex-1 underline" href={courseUrl}>
            Course Link
          </a>
        </div>
      ))}
    </div>
  );
}

export default ScoreCardImage;
