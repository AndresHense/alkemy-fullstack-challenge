import Header from './components/Header'
import Footer from './components/Footer'
import { Container } from 'react-bootstrap'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import UserListScreen from './screens/UserListScreen'
import ProductListScreen from './screens/ProductListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProductEditScreen from './screens/ProductEditScreen'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<ProductListScreen />} />

            <Route path='/page/:pageNumber' element={<ProductListScreen />} />
            <Route path='/login' element={<LoginScreen />} />

            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />

            <Route path='/admin/userlist' element={<UserListScreen />} />

            <Route path='/productlist' element={<ProductListScreen />} />
            <Route
              path='/productlist/:pageNumber'
              element={<ProductListScreen />}
            />

            <Route path='/product/:id/edit' element={<ProductEditScreen />} />
            <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
