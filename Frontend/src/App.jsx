import {Routes, Route} from 'react-router-dom'
import './App.css'
import Header from './componets/header/Header'
import Login from './componets/login/Login'
import Signup from './componets/signup/Signup'
import Landing from './componets/landing/Landing'
import Footer from './componets/footer/Footer'
import AdminDashboard from '../src/componets/admin/adminDashboard/AdminDashboard'
import CustomerDahboard from '../src/componets/customer/customerDashboard/CustomerDahboard'
import CustomerNotifications from './componets/customer/CustomerNotifications/CustomerNotifications'
import AllNotifications from './componets/admin/AllNotifications/AllNotifications'
function App() {
 

  return (
    <>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Landing />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/dashboard" element={<CustomerDahboard />} />
        <Route
          path="/dashboard/notifications"
          element={<CustomerNotifications />}
        />
        <Route path="/admin/notifications" element={<AllNotifications/>} />
      </Routes>
      <Footer />
    </>
  );
}

export default App
