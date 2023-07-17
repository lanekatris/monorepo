import {NextApiRequest, NextApiResponse} from "next";
import fs from 'fs'
import formidable from 'formidable'
import { join } from "path";
import { S3 } from "aws-sdk";
import {PutObjectRequest} from "aws-sdk/clients/s3";

// const FormidableError = formidable.errors.FormidableError;

const parseForm = async (
    req: NextApiRequest
): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise(async (resolve, reject) => {

        const form = formidable({
            uploadDir: join(process.env.ROOT_DIR || process.cwd(), `/public`),
            filename: () => Date.now().toString() + '.csv',
        })

        form.parse(req, function (err, fields, files){
            if (err) reject(err)
            else resolve({fields, files})
        })
    });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({message: 'Method not allowed'})
    }


    const {fields, files} = await parseForm(req)

    var x = files.length

    const Body = fs.readFileSync((files.file as formidable.Files)[0].filepath);
    // const Body = files.file[0]

    const request: PutObjectRequest = {
        Bucket: 'lkat',
        Key: `udisc-scorecards/${Date.now()}.csv`,
        Body
    }

    const s3 = new S3()
    const response = await s3.upload(request).promise()

    // todo: if successful, we need to process this file
    res.status(200).json(response)
}

export const config = {
    api: {
        bodyParser: false,
    },
};
