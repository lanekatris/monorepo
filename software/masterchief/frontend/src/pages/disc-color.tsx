export default function DiscColor({ color }: { color?: string | null }) {
  return (
    <div
      style={{
        backgroundColor: color,
        height: 20,
        width: 20,
        border: '1px solid white',
        display: 'inline-block',
      }}
    ></div>
  );
}
