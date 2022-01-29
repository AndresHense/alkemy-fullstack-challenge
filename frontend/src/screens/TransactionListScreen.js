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
  listTransactions,
  deleteTransaction,
  createTransaction,
} from '../actions/transactionActions'
import { TRANSACTION_CREATE_RESET } from '../constants/transactionConstants'

const TransactionListScreen = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const params = useParams()
  const pageNumber = params.pageNumber || 1

  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  const transactionList = useSelector((state) => state.transactionList)
  const { loading, error, transactions, page, pages } = transactionList

  const transactionDelete = useSelector((state) => state.transactionDelete)
  const {
    success: successDelete,
    loading: loadingDelete,
    error: errorDelete,
  } = transactionDelete

  const transactionCreate = useSelector((state) => state.transactionCreate)
  const {
    success: successCreate,
    loading: loadingCreate,
    error: errorCreate,
    transaction: createdTransaction,
  } = transactionCreate

  let totalAmount = 0
  if (transactions)
    totalAmount = transactions.reduce(
      (acc, p) => acc + (p.type === 'INCOME' ? p.amount : -p.amount),
      0
    )

  useEffect(() => {
    dispatch({ type: TRANSACTION_CREATE_RESET })
    if (!userInfo) {
      navigate('/login')
    }

    if (successCreate) {
      navigate(`/transaction/${createdTransaction._id}/edit`)
    } else {
      dispatch(listTransactions('', pageNumber))
    }
  }, [
    dispatch,
    navigate,
    successDelete,
    userInfo,
    successCreate,
    createdTransaction,
    pageNumber,
  ])

  const deleteHandler = (id) => {
    if (window.confirm('Are you sure?')) {
      dispatch(deleteTransaction(id))
    }
  }
  const createIncomeHandler = () => {
    dispatch(createTransaction('income'))
  }
  const createOutcomeHandler = () => {
    dispatch(createTransaction('outcome'))
  }
  return (
    <>
      <Row className='d-flex justify-content-between my-3'>
        <Col>
          <h1>Transactions</h1>
        </Col>
        <Col>
          {transactions && (
            <Card>
              <ListGroup variant='flush'>
                <ListGroupItem>
                  <Row>
                    <Col md={6}>
                      Outcome: -$
                      {transactions.reduce(
                        (acc, p) => acc + (p.type === 'OUTCOME' ? p.amount : 0),
                        0
                      )}
                    </Col>
                    <Col>
                      Income: +$
                      {transactions.reduce(
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
              {transactions.map((transaction) => (
                <tr key={transaction._id}>
                  <td>{transaction.concept}</td>
                  <td>${transaction.amount}</td>
                  <td>{transaction.type}</td>
                  <td>{transaction.date.substring(0, 10)}</td>
                  <td>
                    <LinkContainer to={`/transaction/${transaction._id}/edit`}>
                      <Button variant='light' className='btn-sm'>
                        <i className='fas fa-edit'></i>
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => deleteHandler(transaction._id)}
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

export default TransactionListScreen
