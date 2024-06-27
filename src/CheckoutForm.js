import React from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {CardElement, Elements, useElements, useStripe} from '@stripe/react-stripe-js';
import { Form, Input, Button, Card, Modal, Menu } from 'antd';
import { useState, useEffect } from 'react';
//import './common.css';
import { useNavigate } from 'react-router-dom';



const CheckoutForm = () => {
    const navigate = useNavigate();
    const stripe = useStripe();
  const elements = useElements();

  const [isModalVisible, setIsModalVisible] = useState(false);//modal ekranı için gerekli değişkenler
    
    const showModal = () => {
      setIsModalVisible(true);
      
    };
    const handleOk = () => {
      setIsModalVisible(false);
    };
    const handleCancel = () => {
      setIsModalVisible(false);
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
      <Button type="primary" onClick={showModal} htmlType="submit" disabled={!stripe}>
        Öde
      </Button>
      <Button type="primary" style={{ marginLeft: '10px' }} htmlType="submit" onClick={() => {navigate('/booking');}}>
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