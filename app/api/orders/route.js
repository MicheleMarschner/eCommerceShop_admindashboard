import { NextResponse } from 'next/server';

import { mongooseConnect } from '@/app/lib/mongoose';
import { isAdminRequest } from '../auth/[...nextauth]/route';
import { Order } from '@/app/models/Order';

export async function GET(req, res) {

    await mongooseConnect();
    await isAdminRequest(req, res);

    const order = await Order.find().sort({createdAt: -1})

    return NextResponse.json(order); // Respond with the parsed JSON


}