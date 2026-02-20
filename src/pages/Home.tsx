import { useState } from "react";
import Product from "./product/Product";
import logo from "../assets/logo.png";
import octopus from "../assets/octopus.png";
import NavBar from "../components/NavBar";
import SideNav from "../components/SideNav";
import Search from "../components/Search";

function Home() {
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800"> 

      <header>
        <div className="flex items-center justify-end h-10 p-4 bg-gray-200 shadow-sm">
          <NavBar />
        </div>
        
        <div className="flex items-center justify-center h-12">
          <SideNav /> 
        </div>
      </header>

      <main className="flex-1 m-4">
        
        <div className="flex items-center gap-4">
          <img 
            src={logo} 
            alt="Gutjjeu Logo" 
            className="w-28 md:w-36 h-auto object-contain"
          />

          <div className="flex-1">
            <Search onSearch={handleSearch} />
          </div>
        </div>
        <div className="m-4">
          <Product searchKeyword={searchKeyword} />
        </div>
      </main>

      <footer className="flex items-center justify-center p-6 bg-gray-800 text-white gap-4 mt-auto">

      <img 
        src={octopus} 
        alt="Gutjjeu Octopus" 
        className="w-12 h-12 object-contain opacity-90 hover:opacity-100 transition-opacity" 
      />

      <div className="text-sm text-gray-400">
        <p className="font-semibold text-gray-300">Gutjjeu Service</p>
        <p>© 2026 Gutjjeu. All rights reserved.</p>
      </div>

      </footer>

    </div>
  );
}

export default Home;