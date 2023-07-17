import {NextApiRequest, NextApiResponse} from "next";
import fs from 'fs'
import formidable from 'formidable'
import { join } from "path";
import {PutObjectCommand, PutObjectRequest, S3Client} from "@aws-sdk/client-s3";
// import { S3 } from "aws-sdk";
// import {PutObjectRequest} from "aws-sdk/clients/s3";

const parseForm = async (
    req: NextApiRequest
): Promise<{ fields: formidable.Fields; file: formidable.File }> => {
    return new Promise(async (resolve, reject) => {

        const form = formidable({
            uploadDir: join(process.env.ROOT_DIR || process.cwd(), `/public`),
            filename: () => Date.now().toString() + '.csv',
        })

        form.parse(req, function (err, fields, files){
            if (err) {
                reject(err)
            }
            else {
                if (Array.isArray(files.file)) {
                    resolve({fields, file: files.file[0]})
                } else {
                    throw new Error('Dont know what to do')
                }
            }
        })
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'})
    }

    const { file} = await parseForm(req)
    // const Body = fs.readFileSync(file.filepath);
    const Body = fs.createReadStream(file.filepath)
    const request: PutObjectRequest = {
        Bucket: 'lkat',
        Key: `udisc-scorecards/${Date.now()}.csv`,
        Body
    }
    const command = new PutObjectCommand(request)

    const s3 = new S3Client({region:'us-east-1'})
    const response = await s3.send(command)

    // todo: if successful, we need to process this file
    res.status(200).json(response)
}

export const config = {
    api: {
        bodyParser: false,
    },
};
