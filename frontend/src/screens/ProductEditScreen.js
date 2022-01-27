import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import axios from 'axios'
import Loader from '../components/Loader'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { detailsProduct, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = () => {
  const [name, setName] = useState('')
  const [price, setPrice] = useState(0)
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [partiture, setPartiture] = useState('')
  const [countInStock, setCountInStock] = useState(0)
  const [uploading, setUploading] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const productDetails = useSelector((state) => state.productDetails)
  const { product, loading, error } = productDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productUpdate = useSelector((state) => state.productUpdate)
  const {
    success: successUpdate,
    loading: loadingUpdate,
    error: errorUpdate,
  } = productUpdate

  const params = useParams()
  const { id } = params
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (successUpdate) {
        dispatch({ type: PRODUCT_UPDATE_RESET })
        navigate('/admin/productlist')
      } else if (!product || product._id !== id) {
        dispatch(detailsProduct(id))
      } else {
        setName(product.name)
        setPrice(product.price)
        setBrand(product.brand)
        setCategory(product.category)
        setCountInStock(product.countInStock)
        setImage(product.image)
        setDescription(product.description)
      }
    } else {
      navigate('/login')
    }
  }, [userInfo, navigate, dispatch, product, id, successUpdate])

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('image', file)
    setUploading(true)
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.post('/api/upload', formData, config)
      setImage(data)
      setUploading(false)
    } catch (error) {
      console.error(error)
      setUploading(false)
    }
  }
  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      updateProduct({
        _id: id,
        name,
        price,
        brand,
        category,
        countInStock,
        image,
        description,
        partiture,
      })
    )
  }

  return (
    <>
      <Link to='/admin/productlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <FormContainer>
          <h1>Edit Product</h1>
          {loadingUpdate && <Loader />}
          {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            <Form onSubmit={submitHandler} controlid='name'>
              <Form.Group className='py-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Enter Name'
                ></Form.Control>
              </Form.Group>

              <Form.Group className='py-2' controlid='price'>
                <Form.Label>price</Form.Label>
                <Form.Control
                  type='number'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder='Enter price'
                ></Form.Control>
              </Form.Group>
              <Form.Group className='py-2' controlid='brand'>
                <Form.Label>Brand</Form.Label>
                <Form.Control
                  type='text'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder='Enter brand'
                ></Form.Control>
              </Form.Group>

              <Form.Group className='py-2' controlid='category'>
                <Form.Label>Category</Form.Label>
                <Form.Control
                  type='text'
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder='Enter category'
                ></Form.Control>
              </Form.Group>

              <Form.Group className='py-2' controlid='countInStock'>
                <Form.Label>Count In Stock</Form.Label>
                <Form.Control
                  type='number'
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  placeholder='Enter Count In Stock'
                ></Form.Control>
              </Form.Group>
              <Form.Group className='py-2' controlid='image'>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  type='text'
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder='Enter image url'
                ></Form.Control>

                <Form.Control
                  type='file'
                  onChange={uploadFileHandler}
                ></Form.Control>
                {uploading && <Loader />}
              </Form.Group>

              <Form.Group className='py-2' controlid='partiture'>
                <Form.Label>Partiture</Form.Label>
                <Form.Control
                  type='text'
                  value={partiture}
                  onChange={(e) => setPartiture(e.target.value)}
                  placeholder='Enter partiture url'
                ></Form.Control>

                <Form.Control
                  type='file'
                  onChange={uploadFileHandler}
                ></Form.Control>
                {uploading && <Loader />}
              </Form.Group>

              <Form.Group className='py-2' controlid='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type='text'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder='Enter description'
                ></Form.Control>
              </Form.Group>

              <Button type='submit' className='w-100 py-3'>
                Update
              </Button>
            </Form>
          )}
        </FormContainer>
      )}
    </>
  )
}

export default ProductEditScreen
