import Axios from "../lib/axios";
import { PRODUCT_API_ROUTES } from "./routes";


const getProducts = async () => {
  const res = await Axios.get(PRODUCT_API_ROUTES.GET.ALL_PRODUCT);
  return res.data;
};

const search = async (data = {}) => {
  const res = await Axios.post(PRODUCT_API_ROUTES.POST.SEARCH, data);
  return res.data;
};

const getProduct = async (data = {}) => {
  const res = await Axios.post(PRODUCT_API_ROUTES.POST.PRODUCT_INFO, data);
  return res.data;
};



const ProductApi = {
  getProducts,
  search,
  getProduct,
};
export default ProductApi;
