import styles from './score-badges.module.css';
import {useMemo} from "react";

export interface ScoreBadgesProps {
  score: number
}

export function ScoreBadges({score}: ScoreBadgesProps) {

  const color = useMemo(() => {
    if (score <= 0) return 'bg-green-500'
    if (score < 5) return 'bg-yellow-500'
    return 'bg-red-500'

  }, [score]);

  return <span className={`text-xs mx-1 font-normal text-white ${color} rounded-full py-0.5 px-1.5`}>{score}</span>;
}

export default ScoreBadges;
