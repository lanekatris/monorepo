import {NextApiRequest, NextApiResponse} from "next";

interface SleepComputer {
    password: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<boolean>){
    const body = JSON.parse(req.body) as SleepComputer
    console.log('body', body, req.body.password, process.env.CUSTOM_PASSWORD)
    if(body.password !== process.env.CUSTOM_PASSWORD){
        return res.status(401).json(false);
    }

    // Intentionally do not wait
    fetch('https://linux.loonison.com/sleep', {
        headers: {
            'CF-Access-Client-Id': process.env.CLOUDFLARE_CLIENT_ID!,
            'CF-Access-Client-Secret': process.env.CLOUDFLARE_CLIENT_SECRET!
        }
    })

    res.status(200).json(true);
}