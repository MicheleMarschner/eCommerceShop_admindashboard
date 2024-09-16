// mark as client component
"use client";

import React, { useEffect, useState } from 'react'

import Layout from '@/app/components/Layout'
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';

function DeleteProduct() {
    const [product, setProduct] = useState(null);

    const params = useParams();
    const id = params.id;
    const router = useRouter();

    useEffect(() => {

        if (!id) return; 

        axios.get('/api/products?id='+id)
          .then(res => setProduct(res.data))
      }, [id])
    
    const goBack = () => {
        router.back();
    }

    const deleteProduct = async() => {
        await axios.delete('/api/products?id='+id);
        goBack();
    }

  return (
    <Layout>
        <h1 className='text-center'>
            {`Do you really want to delete product '${product?.title}'?`}
        </h1>
        <div className='flex gap-2 justify-center'>
            <button className="btn-red" onClick={deleteProduct}>Yes</button>
            <button className="btn-default" onClick={goBack}>No</button>
        </div>
    </Layout>
  )
}

export default DeleteProduct
