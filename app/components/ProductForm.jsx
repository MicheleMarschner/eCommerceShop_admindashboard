import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { redirect } from 'next/navigation';
import Spinner from './Spinner'
import {ReactSortable} from 'react-sortablejs'

function ProductForm({ 
    _id,
    title: existingTitle, 
    description: existingDescription, 
    price: existingPrice,
    images: existingImages,
    category: assignedCategory, 
    properties: assignedProperties
}) {
    const [title, setTitle] = useState( existingTitle || '' );
    const [description, setDescription] = useState( existingDescription || '' );
    const [price, setPrice] = useState( existingPrice || '' );
    const [images, setImages] = useState( existingImages || [] ) 
    const [category, setCategory] = useState( assignedCategory || null ) 
    const [categories, setCategories] = useState( [] ) 
    const [propertiesToFill, setPropertiesToFill] = useState( [] )
    const [productProperties, setProductProperties] = useState( assignedProperties || {} )
    const [goToProducts, setGoToProducts] = useState(false); 
    const [isUploading, setIsUploading] = useState(false); 

    const saveProduct = async(e) => {
        e.preventDefault();

        const data = { title, description, price, images, category, properties: productProperties };

        if (_id) {
            await axios.put('/api/products', {...data, _id})
        } else {
            await axios.post('/api/products', data)
        }
        setGoToProducts(true)
    }

    const uploadImages = async(e) => { 
      const files = e.target?.files;

      if (files?.length > 0) {
        setIsUploading(true)
        const data = new FormData();

        for (const file of files) {
          data.append('file', file);
        }

        const res = await axios.post('/api/upload', {
          method: 'POST',
          body: data,
          headers: {
            'Content-type': "multipart/form-data"
          } 
        }
        )
        console.log(res.data.links)
        setImages( oldImages => {
          return [...oldImages, ...res.data.links]
        })
        setIsUploading(false)
      }
    } 

    const updateImagesOrder = (images) => {
      setImages(images)
    }

    const handleCategoryChange = (selectedCategory) => {

      setCategory(selectedCategory)
      setPropertiesToFill([]);

      let tempProperties = []
      let parentCat = {}
      
      const categoryObj = categories.filter((ele) => {
        return ele._id === selectedCategory
      })

      if (!categoryObj[0]) return;
      
      tempProperties = categoryObj[0].properties

      while(categoryObj[0]?.parent?._id) {
        parentCat = categories.filter((ele) => {
          return ele._id === categoryObj[0].parent._id
        })
        categoryObj[0] = parentCat
      tempProperties = tempProperties.concat( parentCat[0]?.properties)

      }
      
      setPropertiesToFill(tempProperties)
    }

    const setProductProp = (propName, value) => {
      setProductProperties((prev) => {
        const newProductProps = {...prev}
        newProductProps[propName] = value
        return newProductProps
      })
    }
    

    useEffect(() => {
      axios.get('/api/categories')
            .then(res => {
              setCategories(res.data)
              console.log(res.data)
            })

      if (assignedCategory) handleCategoryChange(assignedCategory)
      }, []);

    useEffect(() => {
        if (goToProducts) redirect('/products');   
    }, [goToProducts]);

  return (
    <form onSubmit={saveProduct} method="POST">
        <label>Product name</label>
        <input 
          type="text" 
          placeholder="product name" 
          value={title} 
          onChange={e => setTitle(e.target.value)}
        />
        <label>Category</label>
        <select 
            onChange={e => handleCategoryChange(e.target.value)}
            value={category}
          >
            <option value="">{}</option>
            {categories.length > 0 && categories.map(category => (
              <option value={category._id} key={category._id}>{category.name}</option>
            ))}
          </select>
          {propertiesToFill.length > 0 && (
            <div className='mt-3 mb-2'> {
            propertiesToFill.map(property => (
            <div>
              <label>{property.name[0].toUpperCase()+property.name.substring(1)}</label>
              <div>
                <select  
                  key={property.key}
                  onChange={e => {
                    setProductProp(property?.name, e.target.value)}}
                  value={productProperties[property?.name]}
                >
                  {property?.values.map(v => (
                    <option value={v}>{v}</option>
                  ))}
                </select>
              </div>
              
            </div>
          ))
        }</div>)
          }
        <label>Pictures</label>
        <div className='mb-2 flex flex-wrap gap-1'>
          <ReactSortable 
            list={images} 
            setList={updateImagesOrder}
            className='flex flex-wrap gap-1'>
          {!!images?.length && images.map(link => {
            return (
              <div key={link} className='h-24 bg-white p-4 shadow-sm rounded-s border border-gray-200'>
                <img src={link} alt="" className='rounded-lg'/>
              </div>
            )
          })}
          </ReactSortable>
          {isUploading && (
            <div className='h-24 flex items-center'>
              <Spinner />
            </div>
          )}
          <label className="w-24 h-24 bg-white flex flex-col gap-1 items-center justify-center text-center text-sm text-primary rounded-sm shadow-sm border border-primary cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            <div>Add image</div>
            <input type="file" onChange={uploadImages} className='hidden' />
          </label>
        </div>
        <label>Description</label>
        <textarea 
          placeholder="description" 
          value={description}
          onChange={e => setDescription(e.target.value)}
        >
        </textarea>
        <label>Price (in USD)</label>
        <input 
          type="number" 
          placeholder="price" 
          value={price} 
          onChange={e => setPrice(e.target.value)}
        />
        <button 
          type="submit"
          className="btn-primary"
        >Save</button>
    </form>
  )
}

export default ProductForm
