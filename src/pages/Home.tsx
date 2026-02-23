import { useState } from "react";
import Product from "./product/Product";
import logo from "../assets/logo.png";
import Search from "../components/Search";
import { Link } from "react-router-dom";

function Home() {
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <div className="w-full"> 
      
      <div className="flex items-center gap-4 mb-6">
        <img 
          src={logo} 
          alt="Gutjjeu Logo" 
          className="w-28 md:w-36 h-auto object-contain"
        />
        <div className="flex-1">
          <Search onSearch={handleSearch} />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <Product searchKeyword={searchKeyword} />
      </div>

      <Link to={'/admin/catetory'}>카테고리 등록</Link> <br/>
      <Link to={'/admin/ip'}>아이피 등록</Link>
    </div>
  );
}

export default Home;