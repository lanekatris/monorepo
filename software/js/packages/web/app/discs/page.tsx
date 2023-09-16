import Navigation from 'packages/web/layout/navigation';

export default function DiscsPage() {
  return (
    <main>
      <Navigation />
      <h1>Disc Database</h1>
      <iframe
        className="nc-embed"
        src="https://noco.lkat.io/dashboard/#/nc/view/19588d47-7626-443a-a182-2a9c10059421?embed"
        frameBorder="0"
        width="100%"
        height="700"
        // style="background: transparent; border: 1px solid #ddd"
        style={{ background: 'transparent', border: '1px solid #ddd' }}
      ></iframe>
    </main>
  );
}
