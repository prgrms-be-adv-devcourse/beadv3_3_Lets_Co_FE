import { Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Register from "./pages/auth/Register";
import RegisterCheck from "./pages/auth/RegisterCheck";
import Login from "./pages/auth/Login";
import MyPage from "./pages/user/MyPage";
import Profile from "./pages/user/Profile";
import Seller from "./pages/seller/Seller";
import SellerRegister from "./pages/seller/SellerRegister";
import SellerCheck from "./pages/seller/SellerCheck";
import AddProduct from "./pages/product/AddProduct";

function App() {

  return (
    <div>
      <NavBar/>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/checkCode" element={<RegisterCheck />} />
        <Route path="/login" element={<Login />} />
        <Route path="/my" element={<MyPage />} /> 
        <Route path="/my/profile" element={<Profile />} /> 
        <Route path="/seller" element={<Seller />} /> 
        <Route path="/seller/register" element={<SellerRegister />} /> 
        <Route path="/seller/check" element={<SellerCheck />} /> 
        <Route path="/seller/product/add" element={<AddProduct />} /> 
      </Routes>

    </div>
  );
}

export default App;