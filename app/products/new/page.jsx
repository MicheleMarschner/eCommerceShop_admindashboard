// mark as client component
"use client";

import React from 'react'

import Layout from '../../components/Layout';
import ProductForm from '@/app/components/ProductForm';

function NewProduct() {
  
  return (
    <Layout>
      <h1>New Product</h1>
      <ProductForm />
    </Layout>
  )
}

export default NewProduct
