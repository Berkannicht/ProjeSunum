import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const Register = () => {
    const navigate = useNavigate();
    const onFinish = async (values) => {
    console.log('Form Values:', values);
    
    
  //const transformedData = Object.entries(values);
  

    try {
        const responseData = await axios.get('https://v1.nocodeapi.com/kufursuzhaydo/google_sheets/aIOYInxlYsNJKjkK?tabId=User-Data');
        console.log('responseData', responseData.data.data);
        var arrayofpeople = responseData.data;       
        var rowQueue = responseData.data.data.length+1;
        var userID = ("user" + rowQueue);
        var isUnique = true;

        for(var i = 0; i < arrayofpeople.total; i++){
            console.log('arrayofpeople.data[i]', arrayofpeople.data[i]);
            if(arrayofpeople.data[i].UserName === values.UserName ){
                alert('kullanıcı mevcut');
                isUnique = false;
                break;
            }
            if(arrayofpeople.data[i].Email === values.Email ){
                alert('email mevcut');
                isUnique = false;
                break;
            }
            
      }
        
    if(isUnique){
        const sheetRow = [
            [
              userID, // ID
              values.UserName, // Name
              values.Password, // Email
              values.Email, // Password
                
            ],
            ];
        
        const response = await axios.post('https://v1.nocodeapi.com/kufursuzhaydo/google_sheets/aIOYInxlYsNJKjkK?tabId=User-Data',sheetRow);
        console.log('Response:', response.data);
        alert('Register Successful');
        navigate('/booking'); 
    } 
      } catch (error) {
        if (error.response) {
         
          console.log('Error Data:', error.response.data);
          console.log('Error Status:', error.response.status);
          console.log('Error Headers:', error.response.headers);
        } else if (error.request) {
          
          console.log('Error Request:', error.request);
        } else {
         
          console.log('Error Message:', error.message);
        }
      }
    };
    
  

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form
      name="register"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
      layout="vertical"
    >
      <Form.Item
        label="Email"
        name="Email"
        rules={[{ required: true, message: 'Please input your email!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Kullanıcı Adı"
        name="UserName"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Parola"
        name="Password"
        rules={[{ required: true, message: 'Please input your password!' }]}
      >
        <Input.Password />
      </Form.Item>

      

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Kayıt Ol
        </Button>
      </Form.Item>
    </Form>
  );

};


export default Register; 