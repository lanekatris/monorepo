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
                method: 'POST',
                body: JSON.stringify({password: ref.current!.value})
            })
        }}>
            <input type="password" ref={ref} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" type="submit">
                Go to sleep
            </button>
        </form>

        </>
}