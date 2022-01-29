import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import { LinkContainer } from 'react-router-bootstrap'
import Loader from '../components/Loader'
import Paginate from '../components/Paginate'
import {
  Button,
  Table,
  Row,
  Col,
  ListGroup,
  ListGroupItem,
  Card,
} from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import {
  listProducts,
  deleteProduct,
  createProduct,
} from '../actions/productActions'
import { PRODUCT_CREATE_RESET } from '../constants/productConstants'

const ProductListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const pageNumber = params.pageNumber || 1

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const productList = useSelector((state) => state.productList)
  const { loading, error, products, page, pages } = productList

  const productDelete = useSelector((state) => state.productDelete)
  const {
    success: successDelete,
    loading: loadingDelete,
    error: errorDelete,
  } = productDelete

  const productCreate = useSelector((state) => state.productCreate)
  const {
    success: successCreate,
    loading: loadingCreate,
    error: errorCreate,
    product: createdProduct,
  } = productCreate

  let totalAmount = 0
  if (products)
    totalAmount = products.reduce(
      (acc, p) => acc + (p.type === 'INCOME' ? p.amount : -p.amount),
      0
    )

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET })
    if (!userInfo) {
      navigate('/login')
    }

    if (successCreate) {
      navigate(`/product/${createdProduct._id}/edit`)
    } else {
      dispatch(listProducts('', pageNumber))
    }
  }, [
    dispatch,
    navigate,
    successDelete,
    userInfo,
    successCreate,
    createdProduct,
    pageNumber,
  ])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteProduct(id))
    }
  }
  const createIncomeHandler = () => {
    dispatch(createProduct('income'))
  }
  const createOutcomeHandler = () => {
    dispatch(createProduct('outcome'))
  }
  return (
    <>
      <Row className='d-flex justify-content-between my-3'>
        <Col>
          <h1>Transactions</h1>
        </Col>
        <Col>
          {products && (
            <Card>
              <ListGroup variant='flush'>
                <ListGroupItem>
                  <Row>
                    <Col md={6}>
                      Outcome: -$
                      {products.reduce(
                        (acc, p) => acc + (p.type === 'OUTCOME' ? p.amount : 0),
                        0
                      )}
                    </Col>
                    <Col>
                      Income: +$
                      {products.reduce(
                        (acc, p) => acc + (p.type === 'INCOME' ? p.amount : 0),
                        0
                      )}
                    </Col>
                  </Row>
                </ListGroupItem>
                <ListGroup.Item>
                  Total: {totalAmount >= 0 ? '+' : '-'}${Math.abs(totalAmount)}
                </ListGroup.Item>
              </ListGroup>
            </Card>
          )}
        </Col>
        <Col className=''>
          <Button
            className='my-3 mx-2'
            onClick={createIncomeHandler}
            variant='success'
            style={{ color: 'black' }}
          >
            <i className='fas fa-plus'> New Income</i>
          </Button>
          <Button className='my-3' onClick={createOutcomeHandler}>
            <i className='fas fa-plus'> New Outcome</i>
          </Button>
        </Col>
      </Row>
      {loadingDelete && <Loader />}
      {errorDelete && <Message variant='danger'>{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message variant='danger'>{errorCreate}</Message>}
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <>
          <Table striped bordered hover responsive className='table-sm'>
            <thead>
              <tr>
                <th>CONCEPT</th>
                <th>AMOUNT</th>
                <th>TYPE</th>
                <th>DATE</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td>{product.concept}</td>
                  <td>${product.amount}</td>
                  <td>{product.type}</td>
                  <td>{product.date.substring(0, 10)}</td>
                  <td>
                    <LinkContainer to={`/product/${product._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(product._id)}
                    >
                      <i className='fas fa-trash'></i>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paginate page={page} pages={pages} />
        </>
      )}
    </>
  )
}

export default ProductListScreen
