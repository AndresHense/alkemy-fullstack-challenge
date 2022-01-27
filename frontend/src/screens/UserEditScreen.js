import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { Form, Button } from 'react-bootstrap'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getUserDetails, updateUser } from '../actions/userActions'
import FormContainer from '../components/FormContainer'
import { USER_UPDATE_RESET } from '../constants/userConstants'

const UserEditScreen = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const userDetails = useSelector((state) => state.userDetails)
  const { user, loading, error } = userDetails

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const userUpdate = useSelector((state) => state.userUpdate)
  const {
    success: successUpdate,
    loading: loadingUpdate,
    error: errorUpdate,
  } = userUpdate

  const params = useParams()
  const { id } = params
  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      if (successUpdate) {
        dispatch({ type: USER_UPDATE_RESET })
        navigate('/admin/userlist')
      } else if (!user || user._id !== id) {
        dispatch(getUserDetails(id))
      } else {
        setName(user.name)
        setEmail(user.email)
        setIsAdmin(user.isAdmin)
      }
    } else {
      navigate('/login')
    }
  }, [userInfo, navigate, dispatch, user, id, successUpdate])

  const submitHandler = (e) => {
    e.preventDefault()

    dispatch(updateUser({ _id: id, name, email, isAdmin }))
  }

  return (
    <>
      <Link to='/admin/userlist' className='btn btn-light my-3'>
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <FormContainer>
          <h1>Edit User</h1>
          {loadingUpdate && <Loader />}
          {errorUpdate && <Message variant='danger'>{error}</Message>}
          {loading ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>{error}</Message>
          ) : (
            <Form onSubmit={submitHandler} controlId='name'>
              <Form.Group className='py-2'>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type='text'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder='Enter Name'
                ></Form.Control>
              </Form.Group>
              <Form.Group className='py-2' controlId='email'>
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='Enter an email address'
                ></Form.Control>
              </Form.Group>
              <Form.Group className='py-2' controlId='isadmin'>
                <Form.Check
                  type='checkbox'
                  checked={isAdmin}
                  label='Is Admin'
                  onChange={(e) => setIsAdmin(e.target.checked)}
                ></Form.Check>
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

export default UserEditScreen
