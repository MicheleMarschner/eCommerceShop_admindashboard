// mark as client component
"use client";

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import Layout from '../components/Layout'


function Categories() {
  const [ editedCategory, setEditedCategory ] = useState(null)
  const [ name, setName ] = useState('')
  const [ parentCategory, setParentCategory ] = useState('');
  const [ categories, setCategories ] = useState([]);
  const [ imageUrl, setImageUrl ] = useState('');
  const [ properties, setProperties ] = useState([]);

  const saveCategory = async(e) => {
    e.preventDefault();

    const data = { 
      name, 
      parentCategory, 
      imageUrl,
      properties: properties.map(p => ({
        name: p.name, 
        values: p.values.split(',')
      })) 
    }

    if (editedCategory) {
        data._id = editedCategory._id
        await axios.put('/api/categories', data)
        setEditedCategory(null)
    } else {
        await axios.post('/api/categories', data)
    }

    fetchCategories();
    setName('');
    setParentCategory('');
    setImageUrl('')
    setProperties([]);
  }


  useEffect(() => {
    fetchCategories();
  }, [])

  const fetchCategories = () => {
    axios.get('/api/categories')
      .then(res => setCategories(res.data));
  }

  const addProperty = () => {
    setProperties(prev => {
      return [...prev, {name: '', values: '' }]
    })
  }

  const handlePropertyNameChange = (index, property, newName) => {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].name = newName;
      return properties;
    })
  }

  const handlePropertyValuesChange = (index, property, newValues) => {
    setProperties(prev => {
      const properties = [...prev];
      properties[index].values = newValues;
      return properties;
    })
  }

  const removeProperty = (indexToRemove) => {
    setProperties(prev => {
      return [...prev].filter((p, i) => {
        return i !== indexToRemove;
      });
    })
  }

  const editCategory = (category) => {
    setEditedCategory(category)
    setName(category.name)
    setParentCategory(category.parent?._id)
    setImageUrl(category.imageUrl)
    setProperties(category.properties?.map(
      ({name, values}) => (
        { 
        name, 
        values: values.join(',')
        }
    )))
  }

  const deleteCategory = (category) => {
    withReactContent(Swal).fire({
      title: 'Are you sure',
      text: `Do you want to delete "${category.name}"?`,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#d55',
      reverseButtons: true
    })
      .then(async res => {
        if (res.isConfirmed) {
          const {_id} = category
          await axios.delete('/api/categories?id='+_id);
          fetchCategories();
        }
      })
      
  }

  return (
    <Layout>
        <h1>Categories</h1>
        <label>{editedCategory ? 
          `Edit category "${editedCategory.name}"` 
          : 
          'Create new category'}
        </label>
        <form onSubmit={saveCategory}>
          <div className="flex gap-1 mb-2">
            <input 
              type="text" 
              placeholder={'Category name'}
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
            <select 
              onChange={e => setParentCategory(e.target.value)}
              value={parentCategory}
            >
              <option value="">No parent category</option>
              {categories.length > 0 && categories.map(category => (
                <option value={category._id}>{category.name}</option>
              ))}
            </select>
            <input 
              type="text" 
              placeholder={'Image url'}
              value={imageUrl} 
              onChange={e => setImageUrl(e.target.value)} 
            />
          </div>
          {editedCategory && (
            <div className='mb-2'>
              <label className='block'>Properties</label>
              <button 
                type='button'
                onClick={addProperty} 
                className='btn-default text-sm mb-2'
              >
                Add new property
              </button>
              {properties?.length > 0 && properties?.map((property, index) => {
                return (
                  <div className='flex gap-1 mb-2'>
                    <input 
                      type="text" 
                      onChange={(e) => handlePropertyNameChange(index, property, e.target.value)}
                      value={property?.name} 
                      placeholder='property name (example: color)'
                      className='mb-0' 
                    />
                    <input 
                      type="text" 
                      onChange={(e) => handlePropertyValuesChange(index, property, e.target.value)}
                      value={property?.values} 
                      placeholder='values, comma separated' 
                      className='mb-0'
                    />
                    <button 
                      type='button'
                      className='btn-red'
                      onClick={() => removeProperty(index)}
                    >
                      Remove
                    </button>
                  </div>
                )}
              )}
            </div>
          )}
          <div className="flex gap-1">
            {editedCategory && (
              <button 
                type='button'
                onClick={() => {
                  setEditedCategory(null)
                  setName('');
                  setParentCategory('');
                  setImageUrl('');
                  setProperties([])
                }}
                className="btn-default mr-1"
              >
                Cancel
              </button>
            )}
            <button 
              type='submit' 
              className='btn-primary py-1'
            >
              Save
            </button>
          </div>
        </form>
        {!editedCategory && (
          <table className="basic mt-4">
            <thead>
              <tr>
                <td>Category name</td>
                <td>Parent category</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 && categories.map(category => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td className='flex'>
                  <button
                        className='flex btn-default px-1 items-center mr-1'
                        onClick={() => editCategory(category)}
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                      </svg>
                      Edit</button>
                    
                      <button
                        className='flex btn-red px-1 items-center'
                        onClick={() => deleteCategory(category)}
                      >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    Delete</button>
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>      
        )}
    </Layout>
  )
}

export default Categories
