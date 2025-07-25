import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Dashboard/Dashboard';
import Products from './Product/Products';
import Orders from './Orders/Orders';
import Cart from './Cart/Cart';
import Rating from './Rating/Rating';
import Profile from './Profile/Profile';
import Wallet from './Wallet/Wallet';
import Coupons from './Coupons/Coupons';
import Payment from './Payment/Payment';
import Settings from './Settings/Settings';
import Address from './Address/Address';
import Help from './Help/Help';
import './App.css';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/Home" element={<Dashboard />}/>
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<Products />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/Yourrating" element={<Rating />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/Wallet" element={<Wallet />} />
        <Route path="/Yourcoupons" element={<Coupons />} />
        <Route path="/Payment" element={<Payment />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/address" element={<Address />} />
        <Route path="/help" element={<Help />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;