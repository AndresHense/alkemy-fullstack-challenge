import React,{useEffect} from 'react'
import { Row ,Col} from 'react-bootstrap'
import Product from '../components/Product'
import { useDispatch,useSelector } from 'react-redux'
import { listProducts } from '../actions/productActions'
import Loader from '../components/Loader.js'
import Message from '../components/Message.js'
const HomeScreen = () => {
    const dispatch=useDispatch()
    const productList=useSelector((state)=>state.productList);
    const {products,loading,error}=productList
    useEffect(()=>{
        dispatch(listProducts())
    },[dispatch]);
    
   
    return (
        <>
            <h1>Productos</h1>
            {loading? <Loader/>: error? <Message variant='danger'>{error}</Message>:( 
            <Row>
            {products.map(prod=>(
                <Col key={prod._id} sm={12} md={6} lg={4} xl={3}>
                   <Product product={prod}/>
                </Col>
            ))}
                    
                
            </Row>)}
           
        </>
    )
}

export default HomeScreen
