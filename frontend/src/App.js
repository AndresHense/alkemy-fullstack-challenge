import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import {Container} from 'react-bootstrap';
import CartScreen from './screens/CartScreen';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
function App() {
  return (
    <Router>
      <Header/>
      <main className="py-3">
      <Container>
      <Routes>
        <Route path="/" element={<HomeScreen/>}/>
        <Route path="/product/:id" element={<ProductScreen/>}/>
        <Route path="/cart/:id" element={<CartScreen/>}/>
        <Route path="/cart/" element={<CartScreen/>}/>

        </Routes>
      </Container>  
      </main>
      <Footer/>
    </Router>
  );
}

export default App;
