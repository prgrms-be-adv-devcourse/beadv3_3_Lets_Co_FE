import Sector from "../components/Sector";
import Product from "./product/Product";

import logo from "../assets/logo.png";
import octopus from "../assets/octopus.png";

function Home() {
  return (
    <div> 
      
      <div>
        <img 
          src={logo} 
          alt="Gutjjeu Logo" 
        />
      </div>

      <div>
        <Sector /> 
        
        <hr/>
        
        <Product />
      </div>

      <footer>
        <img 
          src={octopus} 
          alt="Gutjjeu Octopus" 
        />
      </footer>

    </div>
  );
}

export default Home;