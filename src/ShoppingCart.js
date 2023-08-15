import React from 'react'
import { useHistory } from 'react-router-dom'
import "./css/cart.css"
import Checkout from "./Checkout";
import { useAuth0 } from "@auth0/auth0-react";

function ShoppingCart({cart,removeFromCart}) {
    const history =useHistory()
    const { user, isAuthenticated, isLoading } = useAuth0();
  return (
    <div className='checkout'>
        <div className='checkout__left'>
            <img src='https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg' className='checkout__ad'/>
            <div>
                <h3>HELLO {user.name}, </h3>
                <h2 className='checkout__title'>Your shopping Basket</h2>

                {
                    cart?.line_items?.map(item=>{
                        return <div className='checkoutProduct' key={item.id}>
                                    <img src={item.image.url} className='checkoutProduct__img'/>
                                    <div className='checkoutProduct__info'>
                                        <p className='checkoutProduct__title'>{item.name}</p>
                                        <p className='checkoutProduct__price'>
                                            <strong>{item.price.formatted_with_symbol} * {item.quantity} = {cart.currency.symbol} {item.price.raw * item.quantity}</strong>
                                        </p>
                                        <button onClick={()=>removeFromCart(item.id)}>Remove From Basket</button>
                                    </div>
                                </div>
                    })
                }
                        

                
            </div>
        </div>

        <div className='checkout__right'>
            <div className='subtotal'>
                <p>Subtotal ({cart?.total_items} Items): <strong>{cart?.subtotal?.formatted_with_symbol}</strong></p>
                <small className='subtotal__gift'>
                    <input type="checkbox"/> This order contains a Gift
                </small>
            </div> 
            <button onClick={()=>history.push("/checkout")}>Proceed to Checkout</button>
        </div>
    </div>
  )
}

export default ShoppingCart