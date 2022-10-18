export default function DiscColor({ color }: { color?: string | null }) {
  return (
    <div
      style={{
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        backgroundColor: color,
        height: 20,
        width: 20,
        border: '1px solid white',
        display: 'inline-block',
      }}
    ></div>
  );
}
