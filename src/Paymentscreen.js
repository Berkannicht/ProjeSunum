import React from 'react';
import { Form, Input, Button, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import ReactDOM from 'react-dom'


//Bu ekran şu an devre dışı
//Proje üzerinde denemeler için saklıyorum


  






const PaymentScreen = () => {
    const navigate = useNavigate();  
    const [cardNumber, setCardNumber] = useState('');
    const svgNumberRef = useRef(null);
    const isValidCardNumber = (number) => {
    let sum = 0;
    let shouldDouble = false;
    
    for (let i = number.length - 1; i >= 0; i--) {
        let digit = parseInt(number.charAt(i), 10);
  
        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }
  
        sum += digit;
        shouldDouble = !shouldDouble;
    }
  
    
    return sum % 10 === 0;
    //LUHN ALGORITHM
  };

    
  
    
  
  /* const handleCardNumberChange = (e) => {
    const value = e.target.value;
  setCardNumber(value); // Assuming you have a state setter for cardNumber

  // Update the SVG or placeholder element using ref
  if (value.length === 0) {
    svgNumberRef.current.innerHTML = '0123 4567 8910 1112';
  } else {
    // Format the value as needed before setting it
    svgNumberRef.current.innerHTML = value;
  }
  };*/

    
    
    const onFinish = (values) => {
    console.log('Success:', values);
    if (isValidCardNumber(values.cardNumber)) {
      console.log('Card number is valid');
      navigate('/receipt');
  } else {
      console.log('Card number is not valid');
      
  }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <Card title="Payment Details" style={{ width: 300 }}>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="Card Number"
            name="cardNumber"
            rules={[{ required: true, message: 'Please input your card number!' }]}
          >
            <Input maxLength="16" value={cardNumber} type="number" placeholder="XXXX XXXX XXXX XXXX" />
          </Form.Item>

          <Form.Item
            label="Expiry Date"
            name="expiryDate"
            rules={[{ required: true, message: 'Please input your card\'s expiry date!' }]}
          >
            <Input placeholder="MM/YY" type="number" maxLength="5"/>
          </Form.Item>

          <Form.Item
            label="CVV"
            name="cvv"
            rules={[{ required: true, message: 'Please input your card\'s CVV!' }]}
          >
            <Input.Password type="number" maxLength="3"/>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit Payment
            </Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" onClick={() => navigate('/booking')}>
              Go Back
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PaymentScreen;