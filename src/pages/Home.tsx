import Sector from "../components/Sector";
import Product from "./product/Product";

function Home() {

  return (
    <div> 
      <h1>홈페이지</h1>

      <Sector/> <hr/>
      <Product/>
    </div>
  );
}

export default Home;