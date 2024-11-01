import { useEffect, useState } from "react"; 
import { useNavigate } from "react-router-dom"; 
import useApi from "../../hooks/useApi";
import NavBar from "../../components/NavBar";
import "../../public/Products.css";

const ProductsPage = () => {
  const { search, loading, error } = useApi();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 100,
    totalProducts: 0,
    totalPages: 0,
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await search({
        query,
        sort,
        pageNumber: pagination.currentPage,
      });
      if (response) {
        setProducts(response.product);
        setPagination(response.pagination);
      }
    };
    fetchProducts();
  }, [search, query, sort, pagination.currentPage]);

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
  };

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

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
    });
  };

  const handleViewClick = (id) => {
    navigate('/product', { state: { id } });
  };
  return (
    <div>
      <NavBar cart={cart} />
      <div className="search-container">
        <input
          type="text"
          placeholder="Search products..."
          value={query}
          onChange={handleSearchChange}
          className="search-input"
        />
        <select
          value={sort}
          onChange={handleSortChange}
          className="sort-select"
        >
          <option value="">Sort by</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>
      <h1>Products</h1>
      <div className="products-container">
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}
        {!loading && products.length === 0 && <p>No Products available.</p>}
        {products.length > 0 && (
          <div className="products-list">
            {products.map((product) => (
              <div key={product._id} className="product-item">
                <img src={product.image.url} alt={product.title} className="product-image" />
                <h2>{product.title}</h2>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <button onClick={() => addToCart(product)}>Add to Cart</button>
                <button className="view-button" onClick={() => handleViewClick(product._id)}>View</button>
                
    
              </div>
            ))}
          </div>
        )}
        <div className="pagination">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={page === pagination.currentPage}
              >
                {page}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
