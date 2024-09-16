// mark as client component
"use client";

import React, { useEffect, useState } from 'react'

import axios from 'axios';
import { useParams } from 'next/navigation'

import Layout from '@/app/components/Layout'
import ProductForm from '@/app/components/ProductForm';


function EditProduct() {
  const [product, setProduct] = useState(null);
  const params = useParams();
  const id = params.id;
  
  useEffect(() => {

    if (!id) return; 

    axios.get('/api/products?id='+id)
      .then(res => setProduct(res.data))
  }, [id])

  return (
    <Layout>
      <h1>Edit product</h1>
      {product && (
        <ProductForm {...product}/>
      )}
    </Layout>
  )
}

export default EditProduct
