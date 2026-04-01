
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./page/Home"
import Fillter from "./page/Fillter"
import StoreLayout from "./components/Layout/StoreLayout"
import AdminLayout from "./components/Layout/AdminLayout"
import AdminDashboard from "./components/admin/AdminDashboard"
import Product from "./page/admin/Product"
import Category from "./page/admin/Category"
import Users from "./page/admin/Users"
import Success from "./page/Success"
import Order from "./page/admin/Order"
import Catagory from "./page/Catagory"
import Profile from "./page/Profile"
import ProductDetails from "./page/ProductDetails"
import Cancel from "./page/Cancel"
import ProtectedRoutes from "./components/Layout/ProtectedRoutes"

const App = () => {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route element={<StoreLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/fillter/:name" element={<Fillter />} />
            <Route path="/catagory/:id" element={<Catagory />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
          </Route>

          {/* admin routes */}
          <Route element={<ProtectedRoutes />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<Product />} />
              <Route path="/admin/category" element={<Category />} />
              <Route path="/admin/users" element={<Users />} />
              <Route path="/admin/order" element={<Order />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App