import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { useNavigate } from "react-router-dom";
import NavBar from "../../components/NavBar";
import "../../public/Product.css";

const ProductPage = () => {
  const { getProduct, loading, error } = useApi();
  const location = useLocation();
  const navigate = useNavigate();
  const productId = location.state?.id;
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  useEffect(() => {
    if (error === "You must be logged in first") {
        navigate("/login");
    }
  }, [error, navigate]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      const response = await getProduct({ productId });
      if (response) setProduct(response);
    };
    fetchProduct();
  }, [getProduct, productId]);

 
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.productId === product._id);
      if (existingProduct) {
        return prevCart.map((item) =>
          item.productId === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevCart,
          {
            productId: product._id,
            title: product.title,
            image: product.image.url,
            price: product.price,
            quantity: 1,
          },
        ];
      }
    }
  );
 };


  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <NavBar cart={cart} />
      <div className="product-page-container">
        {product ? (
          <>
            <div className="product-top-section">
              <div className="product-image-container">
                <img src={product.image.url} alt={product.title} className="product-detail-image" />
                <button className="add-to-cart-button" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
              <div className="product-details-section">
                <div className="product-info">
                <h1>{product.title}</h1>
                  <p className="product-description">{product.description}</p>
                  <p className="product-category">Category: {product.category}</p>
                  <p className="product-quantity">
                    Quantity: {product.quantity} ({product.quantity > 0 ? "Available" : "Out of Stock"})
                  </p>
                  <p className="product-price">Price: ${product.price}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <p>Product not found</p>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
