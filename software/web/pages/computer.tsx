import {GetServerSideProps, InferGetServerSidePropsType} from "next";
import {useRef} from "react";

interface ComputerInfo {
    fileCounts: {
        obsidianVaultRoot: number
        videosToProcess: number
    },

}

export const getServerSideProps: GetServerSideProps<{info: ComputerInfo}> = async () => {
    const res = await fetch('https://linux.loonison.com/ping', {
        headers: {
            'CF-Access-Client-Id': process.env.CLOUDFLARE_CLIENT_ID!,
            'CF-Access-Client-Secret': process.env.CLOUDFLARE_CLIENT_SECRET!
        }
    })
    const info = await res.json();
    return {
        props: {
            info
        }
    }
}

export default function ComputerInfoPage({info}: InferGetServerSidePropsType<typeof getServerSideProps>){
    console.log(info)
    const ref = useRef<HTMLInputElement>(null);
    return <>
        <h1>computer info</h1>
        <ul>
            <li><b>Obsidian Root Files</b>: {info.fileCounts.obsidianVaultRoot}</li>
            <li><b>Videos To Process</b>: {info.fileCounts.videosToProcess}</li>
        </ul>

        <h1>Go to sleep</h1>
        <form onSubmit={async e => {
            e.preventDefault();
            console.log('submit', ref.current!.value)
            await fetch('/api/sleep', {
                // contentType: 'application/json',
                method: 'POST',
                body: JSON.stringify({password: ref.current!.value})
            })
        }}>
            <input placeholder="password" type="password" ref={ref}/>
            <button type="submit">Go to sleep</button>
        </form>
        {/*<button onClick={() => {*/}

        {/*}}>Sleep</button>*/}

        </>
}