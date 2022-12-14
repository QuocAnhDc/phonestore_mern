import { useEffect, useReducer } from "react";
import { useLocation } from 'react-router-dom';
import axios from "axios";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Product from "../components/Product";
import { Helmet } from "react-helmet-async";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import Button from 'react-bootstrap/Button';
import Carousel from 'react-bootstrap/Carousel';
import LinkContainer from 'react-router-bootstrap/LinkContainer';
// import data from '../data';

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        products: action.payload.products,
        page: action.payload.page,
        pages: action.payload.pages,
        loading: false
      };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

function HomeScreen() {
  const { search } = useLocation();
  const sp = new URLSearchParams(search)
  // console.log(sp)
  const page = sp.get('page') || 1;
  const [{ loading, error, products, pages }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });
  // const [products, setProducts] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "FETCH_REQUEST" });
      try {
        const result = await axios.get(`/api/products/paginate?page=${page}`);
        dispatch({ type: "FETCH_SUCCESS", payload: result.data });
      } catch (err) {
        dispatch({ type: "FETCH_FAIL", payload: err.message });
      }

      // setProducts(result.data);
    };
    fetchData();
  }, [page]);
  const getFilterUrl = (filter) => {
    const filterPage = filter.page || page;
    return `/?page=${filterPage}`;
  };
  return (
    <div>
      <Helmet>
        <title>PhoneStore</title>
      </Helmet>
      <Carousel fade>
        <Carousel.Item>
          <LinkContainer to="/search?brand=639c3e3de78d34c1d1a76401">
          <img 
            width={800}
            height = {450}
            className="d-block w-100"
            src="https://media.idownloadblog.com/wp-content/uploads/2019/09/Apple-Innovation-Event-banner.jpg"
            alt="First slide"
          />
          </LinkContainer>
          <Carousel.Caption>
            <h3>Apple</h3>
            <p>?????t ph?? c??ng ngh???</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <LinkContainer to="/search?brand=6395d4594ffa4adada98d54f">
          <img
            width={800}
            height = {450}
            className="d-block w-100"
            src="https://phuongtung.vn/pt/images/blog/14/banner_7bai-57.jpg"
            alt="Second slide"
          />
          </LinkContainer>

          <Carousel.Caption>
            <h3>Samsung</h3>
            <p>M??n h??nh ?????nh cao</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <LinkContainer to="/search?brand=6395d4914ffa4adada98d564">
          <img
            width={800}
            height = {450}
            className="d-block w-100"
            src="https://trak.in/wp-content/uploads/2017/10/Oppo-Banner.jpg"
            alt="Third slide"
          />
          </LinkContainer>
          <Carousel.Caption>
            <p>
              Hi???u n??ng si??u ?????ng
            </p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <h1>Featured Products</h1>
      <Col className="products">
        {loading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="danger">{error}</MessageBox>
        ) : (
          <>
            <Row>
              {products.map((product) => (
                <Col key={product._id} sm={6} md={4} lg={3} className="mb-3 me-2"
                  style={{ width: '19rem', height: '30rem' }}>
                  <Product product={product}></Product>
                </Col>
              ))}
            </Row>

          </>
        )}
      </Col>
      <Col className="text-center">
        {[...Array(pages).keys()].map((x) => (
          <LinkContainer
            key={x + 1}
            className="mx-1"
            to={getFilterUrl({ page: x + 1 })}
          >
            <Button
              className={Number(page) === x + 1 ? 'text-bold' : ''}
              variant="light"
            >
              {x + 1}
            </Button>
          </LinkContainer>
        ))}
      </Col>

    </div>
  );
}
export default HomeScreen;
