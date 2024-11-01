import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import useApi from "../../hooks/useApi";
import NavBar from "../../components/NavBar";
import "../../public/Cart.css";

const CartPage = () => {
  const { createOrder, loading, error } = useApi();
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    if (error === "You must be logged in first") {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [error, navigate]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleRemoveBook = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const handleCheckout = async (e) => {
    e.preventDefault();
    const items = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    }));
    const response = await createOrder({ items });
    if (response) {
      navigate("/completeOrder", { state: { order: response } });
    }
  };

  return (
    <div>
      <NavBar />
      <div className="cart-content">
        <h1>Cart</h1>
        {cart.length === 0 && <p className="mess">No items in the cart...</p>}
        {cart.length > 0 && (
          <div>
            {cart.map((product, index) => (
              <div key={index} className="cart-item">
                <img src={product.image} alt={product.title} className="cart-item-image" />
                <div className="cart-item-details">
                  <h2>{product.title}</h2>
                  <p>Price: ${product.price}</p>
                  <div className="quantity-input">
                    <label>Quantity:</label>
                    <input
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          product.productId,
                          parseInt(e.target.value, 10)
                        )
                      }
                      min="1"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveBook(product.productId)}
                    className="remove-button"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            {error && <p>{error}</p>}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="checkout-button"
            >
              {loading ? "Processing..." : "Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
