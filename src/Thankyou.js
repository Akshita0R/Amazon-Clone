import React from 'react'
import { Link } from 'react-router-dom'
import "./css/checkout.css"

function Thankyou({cart}) {
  return (
    <div className="order__confirm">
        <h1>Thank You! </h1>
        <h2>Your order is confirmed and will be shipped soon! </h2>
        <h3>Your Order Number id: {cart.id} </h3>
        <h4>Order Total: {cart?.subtotal?.formatted_with_symbol}</h4>
        <Link to="/">
        <button>Continue Shopping</button>
        </Link>
    </div>
  )
}

export default Thankyou 