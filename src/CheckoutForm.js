import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {CardElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';
import { Form, Input, Button, Card, Modal, Menu } from 'antd';
import { useState, useEffect } from 'react';
//import './common.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

//Burada sistem gerçekten kart gerçek mi değil mi kontrol ediyor fakat şimdilik form boş da olsa ok tuşuna basınca 
//ödeme işlemi gerçekleşiyor gibi görünüp dataları google sheet'e post ediyor.

const CheckoutForm = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
  const elements = useElements();

  const [isModalVisible, setIsModalVisible] = useState(false);//modal ekranı için gerekli değişkenler
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  
  useEffect(() => {
    loadOrder();
    console.log('order loaded', checkedBoxes);
    
  }, []);
  
  
  
  
  
  const loadOrder = async () => {//Sepetteki ürünleri local storage'dan yükleyen fonksiyon
    const savedCheckedBoxes = localStorage.getItem('checkedBoxes');
    if (savedCheckedBoxes) {
      setCheckedBoxes(JSON.parse(savedCheckedBoxes));
    }
  };
  const postOrder = async () => {//Sepetteki ürünleri google sheet'e post eden fonksiyon
    
    
    
    const name = localStorage.getItem('username');
    const sheetRows = checkedBoxes.map(box => [box.date, box.title, name, box.choosenField]);
    
      
    const responseMessage = await axios.post('https://v1.nocodeapi.com/kufursuzhaydo/google_sheets/CXLqoGYkELiszZAT?tabId=Booking-Table',sheetRows);
    console.log('responsemessgaeada',responseMessage);
    //console.log('postorder',sheetRows);
   // console.log('checkboxend',checkedBoxes);
    //checkedBoxes.forEach(box => console.log('checkboxendeach', box.title));
    //ischecked={checkedBoxes.some(box => box.date === date && box.title === slot)}
  };


    const showModal = () => {
      setIsModalVisible(true);
      postOrder();
      
    };
    const handleOk = () => {
      setIsModalVisible(false);
      localStorage.removeItem('checkedBoxes');
      navigate('/booking');
    };
    const handleCancel = () => {
      setIsModalVisible(false);
      //localStorage.removeItem('checkedBoxes');
      //navigate('/booking');
    };
    




  const handleSubmit = async (event) => {//ödeme işlemi
    
    event.preventDefault();
    
    if (!stripe || !elements) {
      
      return;
    }

    
    const card = elements.getElement(CardElement);

    if (card == null) {
      return;
    }

    
    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card,
    });

    if (error) {
      console.log('[error]', error);
    } else {
      console.log('[PaymentMethod]', paymentMethod);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      
      <Form.Item>
            
            
            <CardElement
        options={{
          style: {
            base: {
                fontSize: '18px', 
                color: '#495057', 
                fontFamily: '"Helvetica Neue", Helvetica, sans-serif', 
                padding: '10px 12px', 
                '::placeholder': {
                  color: '#6c757d',
              },
            },
            invalid: {
              color: '#9e2146',
            },
          },
        }}
      />
            
          </Form.Item>
      <Button type="primary" onClick={showModal} disabled={!stripe}>
        Öde
      </Button>
      <Button type="primary" style={{ marginLeft: '10px' }} onClick={() => {navigate('/booking');}}>
        Geri
        </Button>
        <Modal title="Thank You" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <p>Thank you, email sent.</p>
      </Modal>
    </form>
  );
};


const stripePromise = loadStripe('pk_test_6pRNASCoBOKtIshFeQd4XMUh');

const App = () => {
  return (
    <Elements stripe={stripePromise}>
        <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '200px' }}>
        <Card title="Ödeme Ekranı" style={{ width: 400 }}>
      <CheckoutForm > </CheckoutForm>
        </Card>
      </div>
    </Elements>
  );
};

export default App;