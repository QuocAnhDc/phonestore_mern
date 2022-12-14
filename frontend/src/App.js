import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/product/ProductScreen';
import Navbar from 'react-bootstrap/Navbar';
import Badge from 'react-bootstrap/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Container from 'react-bootstrap/Container';
import Carousel from 'react-bootstrap/Carousel';
import { LinkContainer } from 'react-router-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartScreen from './screens/order/CartScreen';
import SigninScreen from './screens/authorized/SigninScreen';
import ShippingAddressScreen from './screens/ShippingAddressScreen';
import SignupScreen from './screens/authorized/SignupScreen';
import PaymentMethodScreen from './screens/PaymentMethodScreen';
import PlaceOrderScreen from './screens/order/PlaceOrderScreen';
import OrderScreen from './screens/order/OrderScreen';
import OrderScreenAdmin from './screens/order/OrderScreenAdmin';
import OrderHistoryScreen from './screens/order/OrderHistoryScreen';
import ProfileScreen from './screens/authorized/ProfileScreen';
import Button from 'react-bootstrap/Button';
import { getError } from './utils';
import axios from 'axios';
import SearchBox from './components/SearchBox';
import SearchScreen from './screens/SearchScreen';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardScreen from './screens/DashboardScreen';
import AdminRoute from './components/AdminRoute';
import ProductListScreen from './screens/product/ProductListScreen';
import BrandListScreen from './screens/brand/BrandListScreen';
import CategoryListScreen from './screens/category/CategoryListScreen';
import ProductEditScreen from './screens/product/ProductEditScreen';
import OrderListScreen from './screens/order/OrderListScreen';
import UserListScreen from './screens/authorized/UserListScreen';
import UserEditScreen from './screens/authorized/UserEditScreen';
import MapScreen from './screens/MapScreen';
import BrandEditScreen from './screens/brand/BrandEditScreen';
import CategoryEditScreen from './screens/category/CategoryEditScreen';
import DiscountEditScreen from './screens/discount/DiscountEditScreen';
import DiscountListScreen from './screens/discount/DiscountListScreen';
import { BsCartPlusFill } from "react-icons/bs";

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, cart, userInfo } = state;

  const signoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    const fetchElement = async () => {
      try {
        const { data } = await axios.get(`/api/products/element`);
        setCategories(data.categories);
        setBrands(data.brands);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchElement();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
              ? 'site-container d-flex flex-column full-box'
              : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header style={{ height: 100 }}>
          <Navbar bg="secondary" variant="dark" expand="lg" style={{ height: 75 }}>
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <i className="fas fa-bars"></i>
              </Button>

              <LinkContainer to="/">
                <Navbar.Brand>PhoneStore</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto  w-100  justify-content-end">
                  <Link to="/cart" className="nav-link">
                    <span><BsCartPlusFill/> </span>
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User Profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistory">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={signoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashboard">
                        <NavDropdown.Item>Dashboard</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/products">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/brands">
                        <NavDropdown.Item>Brand</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/categories">
                        <NavDropdown.Item>Category</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Orders</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/discounts">
                        <NavDropdown.Item>Discounts</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-2">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>
            {categories.map((category) => (
              <Nav.Item key={category._id}>
                <LinkContainer
                  to={`/search?category=${category._id}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{category.category}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
            <Nav.Item>
              <strong>Brands</strong>
            </Nav.Item>
            {brands.map((brand) => (
              <Nav.Item key={brand._id}>
                <LinkContainer
                  to={`/search?brand=${brand._id}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  <Nav.Link>{brand.brand}</Nav.Link>
                </LinkContainer>
              </Nav.Item>
            ))}
          </Nav>
        </div>
        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/orderhistory"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="/shipping"
                element={<ShippingAddressScreen />}
              ></Route>
              <Route path="/payment" element={<PaymentMethodScreen />}></Route>
              {/* Admin Routes */}
              <Route
                path="/admin/dashboard"
                element={
                  <AdminRoute>
                    <DashboardScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/products"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/brands"
                element={
                  <AdminRoute>
                    <BrandListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/brand/:id"
                element={
                  <AdminRoute>
                    <BrandEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/categories"
                element={
                  <AdminRoute>
                    <CategoryListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/discounts"
                element={
                  <AdminRoute>
                    <DiscountListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/discount/:id"
                element={
                  <AdminRoute>
                    <DiscountEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/category/:id"
                element={
                  <AdminRoute>
                    <CategoryEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders/:id"
                element={
                  <AdminRoute>
                    <OrderScreenAdmin />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/"
                element={
                  
                    <HomeScreen />
                  
                }
              ></Route>
            </Routes>
          </Container>
        </main>
        <footer>
          <div className="text-center">All rights reserved</div>
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
