import React, { useContext, useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { Store } from '../../Store';
import { getError } from '../../utils';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet-async';
import LoadingBox from '../../components/LoadingBox';
import MessageBox from '../../components/MessageBox';
import Button from 'react-bootstrap/Button';

const reducer = (state, action) => {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'UPDATE_REQUEST':
      return { ...state, loadingUpdate: true };
    case 'UPDATE_SUCCESS':
      return { ...state, loadingUpdate: false };
    case 'UPDATE_FAIL':
      return { ...state, loadingUpdate: false };
    case 'UPLOAD_REQUEST':
      return { ...state, loadingUpload: true, errorUpload: '' };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        loadingUpload: false,
        errorUpload: '',
      };
    case 'UPLOAD_FAIL':
      return { ...state, loadingUpload: false, errorUpload: action.payload };

    default:
      return state;
  }
};


export default function DiscountEditScreen(){

  const navigate = useNavigate();
  const params = useParams(); // /product/:id
  const { id: discountId } = params;

  const { state } = useContext(Store);
  const { userInfo } = state;
  const [{ loading, error, loadingUpdate }, dispatch] =
    useReducer(reducer, {
      loading: true,
      error: '',
    });

  const [type, setType] = useState('');
  const [percent_discount, setPercent] = useState('');
  const [date_start, setStart] = useState('');
  const [date_end, setEnd] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/discounts/${discountId}`);
        setType(data.type);
        setPercent(data.percent_discount);
        setStart(data.date_start);
        setEnd(data.date_end);
        dispatch({ type: 'FETCH_SUCCESS' });
      } catch (err) {
        dispatch({
          type: 'FETCH_FAIL',
          payload: getError(err),
        });
      }
    };
    fetchData();
  }, [discountId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: 'UPDATE_REQUEST' });
      await axios.put(
        `/api/discounts/${discountId}`,
        {
          _id: discountId,
          type,
          percent_discount,
          date_start,
          date_end,
        },
        {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({
        type: 'UPDATE_SUCCESS',
      });
      toast.success('Discount updated successfully');
      navigate('/admin/discounts');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'UPDATE_FAIL' });
    }
  };

  return (
    <Container className="small-container">
      <Helmet>
        <title>Edit Discount </title>
      </Helmet>
      <h1>Edit Discount </h1>

      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3" controlId="discount">
            <Form.Label>Discount</Form.Label>
            <Form.Control
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="percent">
            <Form.Label>PERCENT</Form.Label>
            <Form.Control
              value={percent_discount}
              onChange={(e) => setPercent((e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group controlId="startdate">
            <Form.Label>SET DATE START</Form.Label>
            <Form.Control
              type="date"
              name="startdate"
              placeholder="Due date"
              value={date_start}
              onChange={(e) => setStart(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="endadate">
            <Form.Label>SET DATE END</Form.Label>
              <Form.Control
                type="date"
                name="endate"
                placeholder="Due date"
                value={date_end}
                onChange={(e) => setEnd(e.target.value)}
              />
          </Form.Group>
          <div className="mb-3">
            <Button disabled={loadingUpdate} type="submit">
              Update
            </Button>
            {loadingUpdate && <LoadingBox></LoadingBox>}
          </div>
        </Form>
      )}
    </Container>
  );
}