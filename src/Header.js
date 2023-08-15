import React from 'react'
import "./css/header.css"
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

function Header({cart,categoryList}) {
    const { loginWithRedirect } = useAuth0();
    const { logout } = useAuth0();
    const { user, isAuthenticated, isLoading } = useAuth0();
  return (
    <>
    <div className='header'>
        <Link to="/">
        <img src='http://pngimg.com/uploads/amazon/amazon_PNG11.png' 
        className='header__logo'/>
        </Link>
        <div className='header__search'>
            <input type="text"></input>
            <SearchIcon className='header__searchIcon'/>
        </div>

        <div className='header__nav'>
            {
                isAuthenticated ? <div className='header__option'>
                                    <button className='logout' onClick={() => logout({ returnTo: window.location.origin })}>
                                        Log Out
                                    </button>
                                </div> : <div className='header__option'>
                             <button className='login' onClick={() => loginWithRedirect()}>Log In</button>;
                        </div>
            }

            <div className='header__option'>
                <span className='header__optiongreet'>{isAuthenticated && <p>Welcome, {user.name} </p>}</span>
            </div>

            <div className='header__option'>
                <span className='header__optionone'>Return</span>
                <span className='header__optiontwo'>& Orders</span>
            </div>

            <div className='header__option'>
                <span className='header__optionone'>Your</span>
                <span className='header__optiontwo'>Prime</span>
            </div>

            <div className='header__optionBasket'>
                <Link to="/cart">
                    <ShoppingCartIcon />  
                    <span>{cart?.total_items}</span>
                </Link>  
            </div>            
        </div>

    </div>
    <div className='header__bottom'>
        <ul>
            {
                categoryList?.map(category=>{
                    return <li key={category.id}>
                        <Link to={`/category/${category.slug}`}>
                            <div key={category.slug}>
                        {category.name}
                        </div>
                        </Link>
                        </li>
                })
            }
            <img src="https://m.media-amazon.com/images/G/31/Events/img23/JanART/SWM_400x39_Live_Now._CB615689570_.jpg"></img>
        </ul>
    </div>
    </>
  )
}

export default Header