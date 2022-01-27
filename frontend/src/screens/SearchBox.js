import React, { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const SearchBox = () => {
  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()
  const submitHandler = (e) => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/search/${keyword}`)
    } else {
      navigate(`/`)
    }
  }
  return (
    <Form onSubmit={submitHandler} className='d-flex'>
      <Form.Control
        type='text'
        label='serch product...'
        onChange={(e) => setKeyword(e.target.value)}
        name='q'
        className='mr-sm-2 ml-sm-5'
      ></Form.Control>
      <Button variant='outline-success' type='submit' className='py-2'>
        Search
      </Button>
    </Form>
  )
}

export default SearchBox
