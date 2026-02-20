import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import RegisterCheck from "./pages/auth/RegisterCheck";
import Login from "./pages/auth/Login";
import MyPage from "./pages/user/MyPage";
import Profile from "./pages/user/Profile";
import Seller from "./pages/seller/Seller";
import SellerRegister from "./pages/seller/SellerRegister";
import SellerCheck from "./pages/seller/SellerCheck";
import AddProduct from "./pages/seller/AddProduct";
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
import AdminProduct from "./pages/admin/AdminProduct";
import AdminBoard from "./pages/admin/AdminBoard";
import ManageUser from "./pages/admin/ManageUser";
import ManageUserDetails from "./pages/admin/ManageUserDetails";
import Notice from "./pages/board/Notice";
import Board from "./pages/board/Board";
import AddNotice from "./pages/board/AddNotice";
import NoticeDetails from "./pages/board/NoticeDetails";
import Inquiry from "./pages/board/Inquiry";
import InquiryDetails from "./pages/board/InquiryDetails";
import AddInquiry from "./pages/board/AddInquiry";
import QnADetails from "./pages/board/QnADetails";
import Product from "./pages/product/Product";

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<LocalRegister />} />
        <Route path="/my/complete-profile" element={<OAuth2Register />} />
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
        <Route path="/admin/product" element={<AdminProduct />} /> 
        <Route path="/admin/board" element={<AdminBoard />} /> 

        {/* Proudct */}
        <Route path="/products"element={<Product searchKeyword="" />} />
        <Route path="/products/:ProductCode" element={<ProductDetails />} />
        <Route path="/products/:productcode/qna/:qnaCode" element={<QnADetails />} /> 

        {/* Payment/Cart */}
        <Route path="/payment" element={<Payment />} />
        <Route path="/cart" element={<Cart />} /> 
        <Route path="/toss/checkout" element={<CheckoutPage />} /> 
        <Route path="/toss/success" element={<SuccessPage />} />
        <Route path="/toss/fail" element={<FailPage />} />
        <Route path="/charge" element={<Charge />} /> 
        
        {/* Board (Notice/inquiry) */}
        <Route path="/board" element={<Board />} /> 
        
        <Route path="/board/notice" element={<Notice />} /> 
        <Route path="/board/notice/:noticeCode" element={<NoticeDetails />} /> 
        <Route path="/board/notice/add" element={<AddNotice />} /> 

        <Route path="/board/inquiry" element={<Inquiry />} />  
        <Route path="/board/inquiry/:inquiryCode" element={<InquiryDetails />} />  
        <Route path="/board/inquiry/add" element={<AddInquiry />} /> 

      </Routes>

    </div>
  );
}

export default App;