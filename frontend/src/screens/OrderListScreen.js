import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { LinkContainer } from 'react-router-bootstrap'
import Loader from '../components/Loader'
import { Button, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { deliverOrder, listOrders } from '../actions/orderActions'

const OrderListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const orderList = useSelector((state) => state.orderList)
  const { loading, error, orders } = orderList

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const orderDeliver = useSelector((state) => state.orderDeliver)
  const {
    success: successDeliver,
    loading: loadingDeliver,
    error: errorDeliver,
  } = orderDeliver

  useEffect(() => {
    if (!userInfo.isAdmin) {
      navigate('/login')
    } else {
      dispatch(listOrders())
    }
  }, [dispatch, navigate, userInfo, successDeliver])

  const deliverOrderHandler = (order) => {
    dispatch(deliverOrder(order))
  }
  return (
    <>
      <h1>Order List</h1>
      {loadingDeliver && <Loader />}
      {errorDeliver && <Message variant='danger'>{errorDeliver}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table striped bordered hover responsive className='table-sm'>
          <thead>
            <tr>
              <th>ID</th>
              <th>USER</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.user && order.user.name}</td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    order.paidAt.substring(0, 10)
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    order.deliveredAt.substring(0, 10)
                  ) : (
                    <i className='fas fa-times' style={{ color: 'red' }}></i>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='light' className='btn-sm'>
                      Details
                    </Button>
                  </LinkContainer>
                  <Button
                    variant='light'
                    className='btn-sm'
                    onClick={() => deliverOrderHandler(order)}
                  >
                    <i className='fas fa-check'></i>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default OrderListScreen
