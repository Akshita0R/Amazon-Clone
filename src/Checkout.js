import React, { useEffect, useState } from 'react'
import commerce from "./lib/commerce";
import { Input } from '@mui/material'
import { useHistory } from 'react-router-dom';
import "./css/checkout.css"
import { Link } from 'react-router-dom';


function Checkout({cart,setOrder}) {
  const history = useHistory();
  const [firstname,setfirstname] = useState("");
  const [lastname,setLastname] = useState("");
  const [address,setAddress] = useState("");
  const [email,setEmail] = useState("");
  const [city,setCity] = useState("");
  const [zip,setZip] = useState("");

  const [generatedtoken,setToken] = useState({})
  const [countriesList, setcountriesList] = useState([])
  const [subdivisionList, setSubdivisionList] = useState([])
  const [shippingOptions,setShippingOptions] = useState(null);
  const [country,setcountry] = useState(null);
  const [subdivision,setSubdivision] = useState(null);
  const [shipping,setShipping] = useState(null);

  const getShippingCountries = async(tokenID)=>{
    const {countries} = await commerce.services.localeListShippingCountries(tokenID);
    setcountriesList(Object.entries(countries));
  }

  const getShippingSubdivision = async(country)=>{
    const {subdivisions} = await commerce.services.localeListSubdivisions(country);
    setSubdivisionList(Object.entries(subdivisions))
    setSubdivision(Object.keys(subdivisions)[0]);
  }

  const getShippingOptions = async(tokenID,c,s)=>{
    const response = await commerce.checkout.getShippingOptions(tokenID.id, {
      country: c,
      region: s,
    })
    setShipping(response[0].id)
    setShippingOptions(response)
  }

  useEffect(()=>{
    const generateToke = async(cartID)=>{
      const token = await commerce.checkout.generateToken(cartID, { type: 'cart' })
      setToken(token)
      getShippingCountries(token.id)
    }
    generateToke(cart?.id);
    
  },[cart])

  useEffect(()=>{
    if(country) {
    getShippingSubdivision(country);
    }
  },[country])

  useEffect(()=>{
    if(subdivision) {
      getShippingOptions(generatedtoken,country,subdivision);
    }
  },[subdivision])

  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(generatedtoken){
      const incomingOrder = await commerce.checkout.capture(generatedtoken.id, {
      line_items: generatedtoken.line_items,
      customer: {
        firstname: firstname,
        lastname: lastname,
        email: email
      },
      shipping: {
        name: 'Primary',
        street: address,
        town_city: city,
        county_state: subdivision,
        postal_zip_code: zip,
        country: country
      },
      fulfillment: {
        shipping_method: shipping
      },
      payment: {
        gateway: 'test_gateway',
        card: {
          number: '4242424242424242',
          expiry_month: '02',
          expiry_year: '24',
          cvc: '123',
          postal_zip_code: '94107',
        },
      },
      pay_what_you_want: cart.subtotal.raw
    })
    setOrder(incomingOrder);
    history.push("/Thankyou");
    console.log(incomingOrder)
  }
  }

  return (
      <>
      <div className="limage">
        <img src="https://www.techadvisor.com/wp-content/uploads/2022/06/amazon-prime-day-1.jpg?quality=50&strip=all&w=1024"></img>
      </div>
    <div className= "checkout_wrap">
        <h2>Shipping Details</h2>
        <br/>

        <form onSubmit={e=>handleSubmit(e)}>
          <div className="checkout__form">
          <div className="checkout__column">
              <label>First Name*</label>
              <Input required name="firstname" value={firstname} onChange={e=>setfirstname(e.target.value)}/>
            </div>

            <div className="checkout__column">
              <label>Last Name*</label>
              <Input required name="lastname" value={lastname} onChange={e=>setLastname(e.target.value)}/>
            </div>

            <div className="checkout__column">
              <label>Address*</label>
              <Input required name="address" value={address} onChange={e=>setAddress(e.target.value)}/>
            </div>

            <div className="checkout__column">
              <label>Email*</label>
              <Input required name="email" value={email} onChange={e=>setEmail(e.target.value)}/>
            </div>

            <div className="checkout__column">
              <label>City*</label>
              <Input required name="city" value={city} onChange={e=>setCity(e.target.value)}/>
            </div>

            <div className="checkout__column">
              <label>Zipcode*</label>
              <Input required name="zipcodel" value={zip} onChange={e=>setZip(e.target.value)}/>
            </div>

            <div className="checkout__column">
              <label>Shipping Country*</label>
              <select name="country" value={country} onChange={e=>setcountry(e.target.value)}>
                {
                  countriesList?.map(country=>{
                    return <option value={country[0]}>{country[1]}</option>
                  })
                }
                
                </select>
            </div>

            <div className="checkout__column">
              <label>Shipping Subdivision*</label>
              <select value={subdivision} name="subdivision" onChange={e=>setSubdivision(e.target.value)}>
              {
                  subdivisionList?.map(subdivision=>{
                    return <option value={subdivision[0]}>{subdivision[1]}</option>
                  })
                }
                </select>
            </div>

            {/* <div className="checkout__column">
              <label>Shipping Option*</label>
              <select name="options" value={shipping} onChange={e=>setShipping(e.target.value)} >
                {
                  shippingOptions?.map(item=>{
                    return <option value={item.id}>{item.description} {item.price.formatted_with_symbol}</option>
                  })
                }
                
                </select>
            </div> */}

            <div className="checkout__column">
              <label>&nbsp;</label>
              <Link to="/Thankyou">
              <button>Pay Now</button>
              </Link>
            </div>

            
            </div>

        </form>
    </div>
    </>
  )
}

export default Checkout