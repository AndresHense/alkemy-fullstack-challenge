import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import FormContainer from '../components/FormContainer'
import { saveShippingAddress } from '../actions/cartActions'
import CheckoutSteps from '../components/CheckoutSteps'

const ShippingScreen = () => {
  const cart = useSelector((state) => state.cart)
  const { shippingAddress } = cart

  const dispatch = useDispatch()
  const [address, setAddress] = useState(shippingAddress.address || '')
  const [city, setCity] = useState(shippingAddress.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '')
  const [country, setCountry] = useState(shippingAddress.country || '')

  const navigate = useNavigate()
  const submitHandler = (e) => {
    e.preventDefault()
    dispatch(saveShippingAddress({ address, city, postalCode, country }))
    navigate('/payment')
  }
  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <Form onSubmit={submitHandler}>
        <Form.Group className='py-2' controlId='address'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
            placeholder='Enter Address'
          ></Form.Control>
        </Form.Group>
        <Form.Group className='py-2' controlId='postalCode'>
          <Form.Label>Postal code</Form.Label>
          <Form.Control
            type='text'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
            placeholder='Enter postal code'
          ></Form.Control>
        </Form.Group>
        <Form.Group className='py-2' controlId='city'>
          <Form.Label>City</Form.Label>
          <Form.Control
            type='text'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
            placeholder='Enter city'
          ></Form.Control>
        </Form.Group>
        <Form.Group className='py-2' controlId='country'>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type='text'
            value={country}
            required
            onChange={(e) => setCountry(e.target.value)}
            placeholder='Enter country'
          ></Form.Control>
        </Form.Group>
        <Button type='submit' variant='primary' className='w-100'>
          Continue
        </Button>
      </Form>
    </FormContainer>
  )
}

export default ShippingScreen
