import {GetServerSideProps, InferGetServerSidePropsType} from "next";

interface ComputerInfo {
    fileCounts: {
        obsidianVaultRoot: number
        videosToProcess: 0
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
    return <>
        <h1>computer info</h1>
        <ul>
            <li><b>Obsidian Root Files</b>: {info.fileCounts.obsidianVaultRoot}</li>
            <li><b>Videos To Process</b>: {info.fileCounts.videosToProcess}</li>
        </ul>


        </>
}