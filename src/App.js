import Header from "./Header";
import Product from "./Product";
import { BrowserRouter as Router, Switch, Route, withRouter } from "react-router-dom";
import ShoppingCart from "./ShoppingCart";
import commerce from "./lib/commerce";
import { useEffect, useState } from "react";
import Checkout from "./Checkout";
import Thankyou from "./Thankyou";
import Payment from "./payment";
import Footer from "./Footer";

function App() {

  const [productsList, setProductsList] = useState([]);
  const [productsListByCategory, setProductsListByCategory] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [cart, setCart] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});
  const fetchProducts = async()=>{
    const response = await commerce.products.list();
    console.log(response.data);
    setProductsList(response.data);
  }

  const fetchProductsByCategory = async(category)=>{
    const response = await commerce.products.list({
      category_slug:[category]
    });
    setProductsListByCategory(response.data);
  }

  const addToCart = async(prodId,qty)=>{
    const response = await commerce.cart.add(prodId,qty);
    // console.log(response)
    setCart(response)
  }

  const fetchCart = async()=>{
    setCart(await commerce.cart.retrieve())
  }

  const removeFromCart = async(prodID)=>{
    const response = await commerce.cart.remove(prodID)
    setCart(response);
  }

  const fetchCategories = async()=>{
    const response = await commerce.categories.list();
    // console.log(response)
    setCategoryList(response.data);
  }

  const setOrder = (order)=>{
    setOrderDetails(order)
  }

  useEffect(() => {
    fetchProducts();
    fetchCart();
    fetchCategories();
  }, [])
  

  return (
    <Router>
      <div className="App">
        <Header cart={cart} categoryList={categoryList}/>
      <Switch>
          <Route exact path="/">
            <div className="banner">
             <img src="https://m.media-amazon.com/images/I/71Wqr9Tcn3L._SX1500_.jpg"></img>
            </div>
            <Product productsList={productsList} addToCart={addToCart} />
          </Route>

          <Route exact path="/cart">
            <ShoppingCart cart={cart} removeFromCart={removeFromCart}/>
          </Route>

          <Route exact path="/category/:slug">
            <div style={{marginBottom:"320px"}}></div>
              <Product productsList={productsListByCategory} fetchProductsByCategory={fetchProductsByCategory} addToCart={addToCart} />
          </Route>

          <Route exact path="/checkout">
           <Checkout cart={cart} setOrder={setOrder} />
          </Route>

          <Route exact path="/payment">
           <Payment />
          </Route>

          <Route exact path="/thankyou">
           <Thankyou orderDetails={orderDetails} cart={cart}/>
          </Route>

        </Switch>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
