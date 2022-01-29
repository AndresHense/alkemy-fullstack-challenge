import axios from 'axios'
import {
  TRANSACTION_LIST_REQUEST,
  TRANSACTION_LIST_SUCCESS,
  TRANSACTION_LIST_FAIL,
  TRANSACTION_DETAILS_REQUEST,
  TRANSACTION_DETAILS_SUCCESS,
  TRANSACTION_DETAILS_FAIL,
  TRANSACTION_CREATE_REQUEST,
  TRANSACTION_CREATE_SUCCESS,
  TRANSACTION_CREATE_FAIL,
  TRANSACTION_DELETE_REQUEST,
  TRANSACTION_DELETE_SUCCESS,
  TRANSACTION_DELETE_FAIL,
  TRANSACTION_UPDATE_REQUEST,
  TRANSACTION_UPDATE_SUCCESS,
  TRANSACTION_UPDATE_FAIL,
} from '../constants/transactionConstants'
import { logout } from './userActions'

export const listTransactions =
  (keyword = '', pageNumber = '') =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: TRANSACTION_LIST_REQUEST })
      const {
        userLogin: { userInfo },
      } = getState()
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.get(
        `/api/transactions?pageNumber=${pageNumber}`,
        config
      )
      dispatch({
        type: TRANSACTION_LIST_SUCCESS,
        payload: data,
      })
    } catch (error) {
      dispatch({
        type: TRANSACTION_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      })
    }
  }

export const detailsTransaction = (id) => async (dispatch) => {
  try {
    dispatch({ type: TRANSACTION_DETAILS_REQUEST })
    const { data } = await axios.get(`/api/transactions/${id}`)
    dispatch({
      type: TRANSACTION_DETAILS_SUCCESS,
      payload: data,
    })
  } catch (error) {
    dispatch({
      type: TRANSACTION_DETAILS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    })
  }
}

export const createTransaction = (type) => async (dispatch, getState) => {
  try {
    dispatch({ type: TRANSACTION_CREATE_REQUEST })
    const {
      userLogin: { userInfo },
    } = getState()
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    const { data } = await axios.post(`/api/transactions`, { type }, config)
    dispatch({
      type: TRANSACTION_CREATE_SUCCESS,
      payload: data,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: TRANSACTION_CREATE_FAIL,
      payload: message,
    })
  }
}

export const deleteTransaction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: TRANSACTION_DELETE_REQUEST })
    const {
      userLogin: { userInfo },
    } = getState()
    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    }
    await axios.delete(`/api/transactions/${id}`, config)
    dispatch({
      type: TRANSACTION_DELETE_SUCCESS,
    })
  } catch (error) {
    const message =
      error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
      dispatch(logout())
    }
    dispatch({
      type: TRANSACTION_DELETE_FAIL,
      payload: message,
    })
  }
}

export const updateTransaction =
  (transaction) => async (dispatch, getState) => {
    try {
      dispatch({ type: TRANSACTION_UPDATE_REQUEST })
      const {
        userLogin: { userInfo },
      } = getState()
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      }
      const { data } = await axios.put(
        `/api/transactions/${transaction._id}`,
        transaction,
        config
      )
      dispatch({
        type: TRANSACTION_UPDATE_SUCCESS,
        payload: data,
      })
    } catch (error) {
      const message =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message
      if (message === 'Not authorized, token failed') {
        dispatch(logout())
      }
      dispatch({
        type: TRANSACTION_UPDATE_FAIL,
        payload: message,
      })
    }
  }
