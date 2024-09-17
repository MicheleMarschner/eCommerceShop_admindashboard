import { NextResponse } from 'next/server';

import {Product} from '@/app/models/Product';
import { mongooseConnect } from '@/app/lib/mongoose';
import { isAdminRequest } from '../auth/[...nextauth]/route';


export async function POST(req, res) {
    const body = await req.json(); // Parse the request body as JSON
    const { title, description, price, images, category, properties } = body;

    await mongooseConnect();
    await isAdminRequest(req, res);

    const createdProduct = await Product.create({
        title, description, price, images, category, properties
    })

    return NextResponse.json(createdProduct); // Respond with the parsed JSON
}

export async function PUT(req, res) {
    const body = await req.json(); // Parse the request body as JSON
    const { title, description, price, images, category, properties, _id } = body;

    await mongooseConnect();
    await isAdminRequest(req, res);

    const updatedProduct = await Product.updateOne(
        {_id},
        {title, description, price, images, category, properties}
    )

    return NextResponse.json(updatedProduct); 
}

export async function DELETE(req, res) {

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    

    
    if (!id) NextResponse.json(false);

    await mongooseConnect();
    await isAdminRequest(req, res);

    const deletedProduct = await Product.deleteOne({_id:id})
    
    return NextResponse.json(deletedProduct); 
}

export async function GET(req, res) {

    await mongooseConnect();
    let Products = [];
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    
    if (id) {
        Products = await Product.findOne({_id:id});
        return NextResponse.json(Products); 
    } else {
        Products = await Product.find();
        return NextResponse.json(Products); 
    }
}