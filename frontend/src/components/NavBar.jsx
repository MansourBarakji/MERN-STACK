import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import "../public/NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

const NavBar = ({ cart }) => {
  const { isAuthenticated, logout } = useApi();
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ProductStore
        </Link>
        <ul className="navbar-menu">
          <li>
            <Link to="/products">Products</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <Link to="/userOrders">My Orders</Link>
              </li>
              <li>
                <Link to="/profile">Profile</Link>
              </li>
              <li>
                <button onClick={logout} className="navbar-button">
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </>
          )}
          <li>
            <Link to="/cart" className="navbar-cart" state={{ cart }}>
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="cart-count">
                {cart
                  ? cart.reduce((total, item) => total + item.quantity, 0)
                  : 0}
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
