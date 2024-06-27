import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'antd/dist/antd.js'; 
import BookingCalendar from './BookingCalendar'; 
import LoginScreen from './Login';
import Register from './Register'; 
import PaymentScreen from './Paymentscreen';
import CheckoutForm from './CheckoutForm';

function App() {//Sadece buradaki .js dosyaları kullanılıyor
  return (
    <Router>
      <div style={{ margin: '50px' }}>
        <Routes>
          <Route path="/" element={<LoginScreen />} />
          <Route path="/register" element={<Register />} />
          <Route path="/booking" element={<BookingCalendar />} />
          <Route path="/payment" element={<PaymentScreen />} />
          <Route path="/receipt" element={<receipt />} />
          <Route path="/Checkout" element={<CheckoutForm />} />
        </Routes>
      </div>
    </Router>
  );
}


  



export default App;
// Mounting the App component to the DOM
//ReactDOM.render(<App />, document.getElementById('root'));