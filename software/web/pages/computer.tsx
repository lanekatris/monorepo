import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { useRef } from "react";

interface ComputerInfo {
  fileCounts: {
    obsidianVaultRoot: number;
    videosToProcess: number;
  };
}

const headers = {
  "CF-Access-Client-Id": process.env.CLOUDFLARE_CLIENT_ID!,
  "CF-Access-Client-Secret": process.env.CLOUDFLARE_CLIENT_SECRET!,
};

export const getServerSideProps: GetServerSideProps<{
  info?: ComputerInfo;
}> = async () => {
  console.log("headers", headers);
  const [first, second] = await Promise.all([
    fetch("https://linux.loonison.com/ping", {
      headers,
    }),
    fetch("https://pc.loonison.com/ping", { headers }),
  ]);

  // const info = first.status === 200 ? first.json()
  console.log("statuses", first.status, second.status);
  let info: ComputerInfo | undefined = undefined;
  if (first.status === 200) {
    info = await first.json();
  }
  if (second.status === 200) {
    info = await second.json();
  }

  console.log("info is", info);
  // const info = await res.json();
  return {
    props: {
      info,
    },
  };
};

export default function ComputerInfoPage({
  info,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log(info);
  const ref = useRef<HTMLInputElement>(null);

  if (!info) return <h1>no info</h1>;
  return (
    <>
      <h1>computer info</h1>
      <ul>
        <li>
          <b>Obsidian Root Files</b>: {info.fileCounts.obsidianVaultRoot}
        </li>
        <li>
          <b>Videos To Process</b>: {info.fileCounts.videosToProcess}
        </li>
      </ul>

      <h1>Go to sleep</h1>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          console.log("submit", ref.current!.value);
          await fetch("/api/sleep", {
            method: "POST",
            body: JSON.stringify({ password: ref.current!.value }),
          });
        }}
      >
        <input placeholder="password" type="password" ref={ref} />
        <button type="submit">Go to sleep</button>
      </form>
    </>
  );
}
