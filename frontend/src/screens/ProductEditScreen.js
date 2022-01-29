import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { detailsProduct, updateProduct } from '../actions/productActions'
import FormContainer from '../components/FormContainer'
import { PRODUCT_UPDATE_RESET } from '../constants/productConstants'

const ProductEditScreen = () => {
  const [concept, setConcept] = useState('')
  const [amount, setAmount] = useState(0)
  const [date, setDate] = useState(Date.now())

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
    if (userInfo) {
      if (successUpdate) {
        dispatch({ type: PRODUCT_UPDATE_RESET })
        dispatch(detailsProduct(id))
        navigate('/productlist')
      } else if (!product || product._id !== id) {
        dispatch(detailsProduct(id))
      } else {
        setConcept(product.concept)
        setAmount(product.amount)
        setDate(product.date)
      }
    } else {
      navigate('/login')
    }
  }, [userInfo, navigate, dispatch, product, id, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(
      updateProduct({
        _id: id,
        concept,
        amount,
        date,
      })
    )
  }

  return (
    <>
      <Link to='/productlist' className='btn btn-light my-3'>
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
            <Form onSubmit={submitHandler} controlid='concept'>
              <Form.Group className='py-2'>
                <Form.Label>Concept</Form.Label>
                <Form.Control
                  type='text'
                  value={concept}
                  onChange={(e) => setConcept(e.target.value)}
                  placeholder='Enter concept'
                ></Form.Control>
              </Form.Group>

              <Form.Group className='py-2' controlid='amount'>
                <Form.Label>Amount</Form.Label>
                <Form.Control
                  type='number'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder='Enter amount'
                ></Form.Control>
              </Form.Group>

              <Form.Group className='py-2' controlid='date'>
                <Form.Label>Date</Form.Label>
                <Form.Control
                  type='date'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
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
