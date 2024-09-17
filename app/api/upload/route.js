import { NextResponse } from 'next/server';
import {PutObjectCommand, S3Client} from '@aws-sdk/client-s3'; 
import { isAdminRequest } from '../auth/[...nextauth]/route';

export const config = {
    api: {
        bodyParser: false}
}

export async function POST(req, res) {
    try {
        
        const formData = await req.formData();
        const files = formData.getAll('file') || [];

        const links = [];

        await isAdminRequest(req, res);


        if (Array.isArray(files)) {
            const uploadPromises = files.map(async (file) => {
                const binaryFile = await file.arrayBuffer();
                const fileBuffer = Buffer.from(binaryFile);

                const client = new S3Client({
                    region: process.env.S3_AWS_REGION,
                    credentials: {
                        accessKeyId: process.env.S3_ACCESS_KEY,
                        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
                    }
                });

                const params = {
                    Bucket: process.env.S3_AWS_BUCKET_NAME,
                    Key: file.name,
                    Body: fileBuffer,
                    ACL: 'public-read',
                    ContentType: file.type,
                };

                await client.send(new PutObjectCommand(params));
                const link = `https://${process.env.S3_AWS_BUCKET_NAME}.s3.amazonaws.com/${file.name}`;
                links.push(link);
            });

            // Wait for all uploads to complete
            await Promise.all(uploadPromises);
        }

        return NextResponse.json({ links });
    } catch (err) {
        console.error('Error processing form:', err);
        return NextResponse.json({ success: false, message: 'File upload failed.' }, { status: 500 });
    }
}