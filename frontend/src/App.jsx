import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import LoginPage from './pages/user/Login';
import ProfilePage from './pages/user/Profile';
import EditProfilePage from './pages/user/EditProfile';
import ResetPasswordPage from './pages/user/ResetPassword';
import ForgotPasswordPage from './pages/user/ForgotPassword';
import ProductsPage from './pages/product/AllProducts';
import ProductPage from './pages/product/ProductPage';
import CartPage from './pages/order/Cart';
import CompleteOrderPage from './pages/order/CreateOrder';
import OrderInfoPage from './pages/order/OrderDetails'
import UserOrdersPage from './pages/order/UserOrders';
import NotFoundPage from './pages/NotFound';
const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/editProfile" element={<EditProfilePage />} />
        <Route path="/forgotPassword" element={<ForgotPasswordPage />} />
        <Route path="/resetPassword/:resetToken" element={<ResetPasswordPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/completeOrder" element={<CompleteOrderPage />} />
        <Route path="/orderInfo" element={<OrderInfoPage />} />
        <Route path="/userOrders" element={<UserOrdersPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default App;
