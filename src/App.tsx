import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import RegisterCheck from "./pages/auth/RegisterCheck";
import Login from "./pages/auth/Login";
import MyPage from "./pages/user/MyPage";
import Profile from "./pages/user/Profile";
import Seller from "./pages/seller/Seller";
import SellerRegister from "./pages/seller/SellerRegister";
import SellerCheck from "./pages/seller/SellerCheck";
import AddProduct from "./pages/product/AddProduct";
import ProductDetails from "./pages/product/ProductDetails";
import Payment from "./pages/order/Payment";
import Cart from "./pages/order/Cart";
import Charge from "./pages/order/Charge";

import CheckoutPage from "./pages/toss/CheckoutPage";
import SuccessPage from "./pages/toss/SuccessPage";
import FailPage from "./pages/toss/FailPage";
import LocalRegister from "./pages/auth/LocalRegister";
import OAuth2Register from "./pages/auth/OAuth2Register";
import Address from "./pages/user/Address";
import Card from "./pages/user/Card";
import Admin from "./pages/admin/Admin";
import ManageProduct from "./pages/admin/ManageProduct";
import ManageBoard from "./pages/admin/ManageBoard";
import ManageUser from "./pages/admin/ManageUser";
import ManageUserDetails from "./pages/admin/ManageUserDetails";

function App() {

  return (
    <div>
      <NavBar/>

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<LocalRegister />} />
        <Route path="/oauth2" element={<OAuth2Register />} />
        <Route path="/checkCode" element={<RegisterCheck />} />

        {/* User */}
        <Route path="/my" element={<MyPage />} /> 
        <Route path="/my/profile" element={<Profile />} /> 
        <Route path="/my/address" element={<Address />} />
        <Route path="/my/card" element={<Card />} />        

        {/* Seller */}
        <Route path="/seller" element={<Seller />} /> 
        <Route path="/seller/register" element={<SellerRegister />} /> 
        <Route path="/seller/check" element={<SellerCheck />} /> 
        <Route path="/seller/product/add" element={<AddProduct />} /> 

        {/* Admin */}
        <Route path="/admin" element={<Admin />} /> 
        <Route path="/admin/users" element={<ManageUser />} /> 
        <Route path="/admin/users/:id" element={<ManageUserDetails />} /> 
        <Route path="/admin/product" element={<ManageProduct />} /> 
        <Route path="/admin/board" element={<ManageBoard />} /> 

        {/* Proudct */}
        <Route path="/products/:optionCode" element={<ProductDetails />} />
        <Route path="/payment" element={<Payment />} />

        {/* Order/Payment */}
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/charge" element={<Charge />} /> 
        <Route path="/toss/checkout" element={<CheckoutPage />} /> 
        <Route path="/toss/success" element={<SuccessPage />} />
        <Route path="/toss/fail" element={<FailPage />} />
      </Routes>

    </div>
  );
}

export default App;