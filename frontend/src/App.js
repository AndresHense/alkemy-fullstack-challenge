import Header from './components/Header'
import Footer from './components/Footer'
import { Container } from 'react-bootstrap'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import ProfileScreen from './screens/ProfileScreen'
import UserListScreen from './screens/UserListScreen'
import TransactionListScreen from './screens/TransactionListScreen'
import UserEditScreen from './screens/UserEditScreen'
import TransactionEditScreen from './screens/TransactionEditScreen'

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
function App() {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Routes>
            <Route path='/' element={<TransactionListScreen />} />

            <Route
              path='/page/:pageNumber'
              element={<TransactionListScreen />}
            />
            <Route path='/login' element={<LoginScreen />} />

            <Route path='/register' element={<RegisterScreen />} />
            <Route path='/profile' element={<ProfileScreen />} />

            <Route path='/admin/userlist' element={<UserListScreen />} />

            <Route
              path='/transactionlist'
              element={<TransactionListScreen />}
            />
            <Route
              path='/transactionlist/:pageNumber'
              element={<TransactionListScreen />}
            />

            <Route
              path='/transaction/:id/edit'
              element={<TransactionEditScreen />}
            />
            <Route path='/admin/user/:id/edit' element={<UserEditScreen />} />
          </Routes>
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
