import React, {useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Input, Button, Checkbox } from 'antd';
import 'antd/dist/antd.js'; // Import Ant Design styles
import axios from 'axios';




const LoginScreen = () => {
    //console.log('giriş ekranı');
    const navigate = useNavigate();
    
    
   /* function login(username, password) {
      console.log('loginscreen');
      fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then(response => response.json())
      .then(data => {
      localStorage.setItem('token', data.token);
      console.log('token', data.token); // Moved inside the .then() where `data` is defined
      console.log('gottentoken', localStorage.getItem('token')); // This is fine here
  })
      .catch(error => console.error('Error:', error));
    }
    */
    /*const login = async (username, password) => {
      console.log('loginscreen');
      try {
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        localStorage.setItem('token', data.token);
        console.log('token', data.token);
        console.log('gottentoken', localStorage.getItem('token'));
      } catch (error) {
        console.error('Error:', error);
      }
    };*/
    
    
    const createAndSaveToken = (username, password) => {// token oluşturuluyor ve local storage kaydediliyor ama devre dışı
      const baseToken = btoa(`${username}:${password}`);
      const token = `mockToken-${baseToken}-${Date.now()}`;
    
      // Save the token to localStorage
      localStorage.setItem('token', token);
    
      console.log('Token created and saved:', token);
    };

    const setLoginStatus = () => {// kullanıcı giriş yapmış mı kontrolü
      
      if (localStorage.getItem('isLoggedIn') === null) {
        localStorage.setItem('isLoggedIn', 'false');
      }
    
      
      localStorage.setItem('isLoggedIn', 'true');
      console.log('Login status set to true and saved.');
    };

    
    const onFinish = async (values) => {// giriş yapılıyor
    console.log('onfinis',);
    try {
      console.log('loginname', values.username);
      console.log('loginpsw', values.password);
     
      const endpoint = 'https://v1.nocodeapi.com/kufursuzhaydo/google_sheets/aIOYInxlYsNJKjkK?tabId=User-Data';
      
      const response = await axios.get(endpoint);
      //console.log('response', response);
      const arrayofpeople = response.data; 
      //console.log('users', arrayofpeople);
      
      
      for(var i = 0; i < arrayofpeople.total; i++){
          //console.log('arrayofpeople.data[i]', arrayofpeople.data[i]);
          if(arrayofpeople.data[i].UserName === values.username ){
            if(arrayofpeople.data[i].Password === values.password ){
             var key = 1;
            }
            else{ key = 0;}
          
      }
    }
      
      //console.log('users', arrayofpeople.data.UserName);
      console.log('keyy', key);
      if (key) {
        alert('Griş Başarılı');
        console.log('Login Successful:', values);
        if (values.remember) {
          console.log('Remember me saved:');
          localStorage.setItem('username', values.username);
          localStorage.setItem('password', values.password);
        }
        else{
          localStorage.setItem('username',"" );
          localStorage.setItem('password', "");

        }
        setLoginStatus();
        //createAndSaveToken(values.username, values.password);
        navigate('/booking');
        
      } else {
        alert('Giriş Başarısız');
        console.log('Login Failed: Invalid credentials');
        
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div style={{ maxWidth: '300px', margin: 'auto', marginTop: '50px' }}>
      <Form
        name="basic"
        initialValues={{ remember: true , username: localStorage.getItem('username'), password: localStorage.getItem('password')}}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Kullanıcı adı"
          name="username"
          
          rules={[{ required: true, message: 'Kullanıcı adınızı giriniz!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Parola"
          name="password"
          rules={[{ required: true, message: 'Şifrenizi giriniz!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
          <Checkbox>Beni Hatırla</Checkbox>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Giriş
          </Button>
          <Button type="default" style={{ marginLeft: '10px' }} onClick={() => {navigate('/Register');}}>
          Kayıt Ol
          </Button>
        </Form.Item>
      </Form>
    </div>
  );

}
export default LoginScreen;