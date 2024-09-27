import Link from 'next/link';

interface MetricCardV2Props {
  completed: number;
  total: number;
  title: string;
  link?: string;
}

export function MetricCardV2({
  completed,
  total,
  link,
  title
}: MetricCardV2Props) {
  return (
    <div className={'flash default'}>
      <b>{title}</b>
      <br />
      <small>
        <span className={'muted bg-muted'}>
          {completed}/{total}
        </span>{' '}
        {link && <Link href={link}>More Info</Link>}
      </small>
      <meter
        low={completed}
        high={total}
        max={total}
        value={completed}
        optimum={total}
      ></meter>
    </div>
  );
}
