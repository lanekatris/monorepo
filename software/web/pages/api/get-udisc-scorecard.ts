import {NextApiRequest, NextApiResponse} from "next";
import {GetObjectCommand, ListObjectsV2Command, S3Client} from "@aws-sdk/client-s3";



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const command = new ListObjectsV2Command({
        Bucket: 'lkat',
        Prefix: 'udisc-scorecards'
    })

    const s3 = new S3Client({region:'us-east-1'})
    const response = await s3.send(command)

    if (!response.Contents?.length) return res.status(404).json({error: 'No scorecards found'})

    // Sorted by keyname already from AWS, it'll be a while before I reach the 1000 limit
    const latest = response.Contents[response.Contents.length - 1  ]


    const objectCommand = new GetObjectCommand({
        Bucket: 'lkat',
        Key: latest.Key
    })
    const objectResponse = await s3.send(objectCommand)
    const latestScorecardBody = await objectResponse.Body?.transformToString()


    // parse the csv to a useful scorecard



    res.status(200).json({response,latest, latestScorecardBody})

}