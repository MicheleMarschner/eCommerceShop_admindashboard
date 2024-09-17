import { NextResponse } from 'next/server';

import {Category} from '@/app/models/Category';
import { mongooseConnect } from '@/app/lib/mongoose';
import { isAdminRequest } from '../auth/[...nextauth]/route';

export async function POST(req, res) {
    const body = await req.json(); // Parse the request body as JSON
    const { name, parentCategory, properties } = body;

    await mongooseConnect();
    //await isAdminRequest(req, res);

    const newCategory = await Category.create({ 
        name, 
        parent: parentCategory || undefined,
        properties
    })

    return NextResponse.json(newCategory); // Respond with the parsed JSON
}

export async function GET(req, res) {

    await mongooseConnect();
    let Categories = [];
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    
    if (id) {
        Categories = await Category.findOne({_id:id}).populate('parent');
        return NextResponse.json(Categories); 
    } else {
        Categories = await Category.find().populate('parent');
        return NextResponse.json(Categories); 
    }
}

export async function PUT(req, res) {
    const body = await req.json(); // Parse the request body as JSON
    const { category, parentCategory, properties, _id } = body;

    await mongooseConnect();
    //await isAdminRequest(req, res);

    const updatedCategory = await Category.updateOne(
        {_id},
        {
            category, 
            parent: parentCategory || undefined, 
            properties
        }
    )

    return NextResponse.json(updatedCategory); 
}

export async function DELETE(req, res) {

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) NextResponse.json(false);

    await mongooseConnect();
    await isAdminRequest(req, res);

    const deletedCategory = await Category.deleteOne({_id:id})
    
    return NextResponse.json(deletedCategory); 
}