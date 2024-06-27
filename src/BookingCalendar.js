import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import {  Alert, Calendar, Button, Row, Col, Avatar, Space, Dropdown, Menu, Modal, Checkbox,} from 'antd';
import { Tree } from "antd";
import moment, { now } from 'moment';
import { UserOutlined } from '@ant-design/icons';
import 'antd/dist/antd.js'; 
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';



function BookingCalendar() {
  const navigate = useNavigate();
  const [checkedBoxes, setCheckedBoxes] = useState([]);
  const [value, setValue] = useState(dayjs());
  const [selectedValue, setSelectedValue] = useState(dayjs());
  //const [todaysValue, setTodaysValue] = useState(dayjs());
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const todaysValue = moment();
  const [boughtItems, setBoughtItems] = useState([]);
  const [choosenField, setChoosenField] = useState('Saha 1');
  //Değişkenler tanımlandı
  
  useEffect(() => {
    //İlk Çalıştırılacak komutlar
    checkLoginStatus();
    
    fetchOrder();
    loadOrder();
  }, []);
  
 
  
  const headerRender = () => {
    return (
      <div className="custom-calendar-header">
        halisaha
      </div>
    );
  };
  
  const removeBox = (date, title) => { 
    //setCheckedBoxes(checkedBoxes.filter((_, index) => index !== indexToRemove));
    setCheckedBoxes(checkedBoxes.filter(box => box.date !== date || box.title !== title));
    
  };
  
  // Kullanıcı giriş yapmış mı basit bir kotrol mekanizması
  const setLoginStatus = () => {
    
    if (localStorage.getItem('isLoggedIn') === null)  {
      localStorage.setItem('isLoggedIn', 'false');
      console.log('Access denied. Please log in.');
    }
  
    
    localStorage.setItem('isLoggedIn', 'false');
    console.log('Login status set to true and saved.');
  };

  const checkLoginStatus = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
  
    if (isLoggedIn === 'true') {
      console.log('Access granted');
      
      return true;
    } else {
      console.log('Access denied. Please log in.');
      alert('Access denied. Please log in.');
      navigate('/');
      
      // window.location.href = '/login';
      return false;
    }
  };

  const handleCheckboxChange = (date, title, isChecked) => { //Her bir checkbox değiştiğinde çalışacak fonksiyon
    if (isChecked) {
      setCheckedBoxes(prev => [...prev, { date: date.format('DD-MM-YYYY'), title, choosenField }]);
      console.log('selectedboxesadd',checkedBoxes);
    } else {
      setCheckedBoxes(prev => prev.filter(box => box.date !== date.format('DD-MM-YYYY') || box.title !== title || box.choosenField !== choosenField));
      console.log('selectedboxesdelete',checkedBoxes);
    }
    localStorage.setItem('checkedBoxes', JSON.stringify(checkedBoxes));
  };
  
  
  const toggleModal = () => { //Sepetin açılıp kapanmasını sağlayan fonksiyon
    setIsModalVisible(!isModalVisible);
  };
  
  const onSelect = (newValue) => { //Takvimde tarih seçildiğinde çalışacak fonksiyon
     setValue(newValue);
     setSelectedValue(newValue);
   };
 
    const onPanelChange = (newValue) => { //Takvimde tarih değiştirildiğinde çalışacak fonksiyon
     setValue(newValue);
     
   };

   const handleMenuClick = (e) => { //Saha seçildiğinde çalışacak fonksiyon
    // Handle the section selection here
    console.log(`Selected section: ${e.key}`);
    setChoosenField(e.key);
  };

   const menu = ( //Saha seçim menüsü

    
    <Menu onClick={handleMenuClick}>
      {["Saha 1", "Saha 2", "Saha 3", "Saha 4"].map((section, index) => (
        <Menu.Item key={section}>{section}</Menu.Item>
      ))}
    </Menu>
    
    );


   
   


  const dateCellRender = (date) => {//Takvimde tarih seçildiğinde kutuların render edilmesini sağlayan fonksiyon
    //console.log('datecellrender');
    //console.log('checkedboxes', checkedBoxes);
    //console.log('fboughtitemsinrender', boughtItems);
    
    const titles = [
      '15:00-16:00', '16:00-17:00', '17:00-18:00', '18:00-19:00',
      '19:00-20:00', '20:00-21:00', '21:00-22:00', '22:00-23:00',
      '23:00-00:00', '00:00-01:00', '01:00-02:00', '02:00-03:00',
    ];

   
    return (
      <div>
        {titles.map((slot, index) => {
            
            const slotDateTime = moment(`${date.format('DD-MM-YYYY')} ${slot.split('-')[0]}`, 'DD-MM-YYYY HH:mm');
            const now = moment();
            const isPast = slotDateTime.isBefore(now);
          return (
          <div key={index}>
            



            <Checkbox
              onChange={(e) => handleCheckboxChange(date, slot, e.target.checked)}
              //checked={checkedTitles.includes(slot)}
              //onPanelChange={resetCheckedBoxesState}
              checked={checkedBoxes.some(box => box.date === date.format('DD-MM-YYYY') && box.title === slot && box.choosenField === choosenField)}
              disabled={boughtItems.some(box => box.Date === date.format('DD-MM-YYYY') && box.Title === slot) || isPast}
              defaultChecked = {boughtItems.some(box => box.Date === date.format('DD-MM-YYYY') && box.Title === slot && box.choosenField === choosenField)}
              indeterminate = {isPast}
            >
              {slot}
            </Checkbox>
          </div>
          );
  })}
      </div>
    );
  };
  const saveOrder = async () => {//Sepetteki ürünleri local storage'a kaydeden fonksiyon

    localStorage.setItem('checkedBoxes', JSON.stringify(checkedBoxes));
    console.log('saveorder',checkedBoxes);


  };

  const loadOrder = async () => {//Sepetteki ürünleri local storage'dan yükleyen fonksiyon
    const savedCheckedBoxes = localStorage.getItem('checkedBoxes');
    if (savedCheckedBoxes) {
      setCheckedBoxes(JSON.parse(savedCheckedBoxes));
      console.log('loadorder',checkedBoxes);
    }
  };
  
   const postOrder = async () => {//Sepetteki ürünleri google sheet'e post eden fonksiyon
    const name = localStorage.getItem('username');
    const sheetRows = checkedBoxes.map(box => [box.date, box.title, name, box.choosenField]);
    const sheetRow = [
      [
        //userID, // ID
        checkedBoxes.date, // Name
        checkedBoxes.title, // Email
        
      
      ],
      ];
      
    const responseMessage = await axios.post('https://v1.nocodeapi.com/kufursuzhaydo/google_sheets/CXLqoGYkELiszZAT?tabId=Booking-Table',sheetRows);
    console.log('responsemessgaeada',responseMessage);
    //console.log('postorder',sheetRows);
   // console.log('checkboxend',checkedBoxes);
    //checkedBoxes.forEach(box => console.log('checkboxendeach', box.title));
    //ischecked={checkedBoxes.some(box => box.date === date && box.title === slot)}
  };

  const fetchOrder = async () => {//Google sheet'ten verileri çeken fonksiyon
    const responseData = await axios.get('https://v1.nocodeapi.com/kufursuzhaydo/google_sheets/CXLqoGYkELiszZAT?tabId=Booking-Table');
    if(responseData.data.data){
      console.log('responsedataaaaa', responseData);
    console.log('fetchedorderdata', responseData.data.data);
    setBoughtItems(responseData.data.data);
    console.log('fboughtitems', boughtItems);
    console.log('checkedboxes', checkedBoxes);
  }
  };
  const logOutmenu = (//Çıkış yapma menüsü
    <Menu>
      <Menu.Item key="logout" onClick={() => {navigate('/'); setLoginStatus();}}>
        Çıkış
      </Menu.Item>
    </Menu>
  );

  const orderBoxMenu = (//Sepet menüsü
    <Menu>
    {checkedBoxes.map((box, index) => (
      <Menu.Item key={index}>
        {box.title} - {box.date} - {box.choosenField} {"1200 tl"}
        {/* x'e basınca item silme*/}
        <Button 
          type="text" 
          onClick={(e) => {
            e.stopPropagation(); 
            removeBox(box.date, box.title);
          }}
          style={{ marginLeft: 'auto', color: 'red' }}
        >
          X
        </Button>
        
      </Menu.Item>      
    ))}

  <Menu.Item>
    Toplam: {checkedBoxes.length * 1200} TL
  </Menu.Item>
 </Menu>
  );

  return (
    <>
      <Row justify="end" style={{ marginBottom: 20 }}>
        <Col>
        
             <Button type="primary" onClick={toggleModal}>Sepet</Button>
          
        </Col>
          <Modal
          title="Sepet"
          visible={isModalVisible}
          onOk={() => {
           // postOrder();
            saveOrder();
            navigate('/Checkout');
            
          }}
          onCancel={() => {
            toggleModal();
            saveOrder();
          }} >
          
          {orderBoxMenu} 

          </Modal>
        
        
        <Col>
          
          <Dropdown overlay={logOutmenu} trigger={['click']}>
          
          <Button type="link">
            <Avatar src='https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg' />
          </Button>
          </Dropdown>
        </Col>
      </Row>
      
      <Alert message={`Seçili Gün: ${selectedValue.format('DD-MM-YYYY')}`} />
      <Alert style={{ marginBottom: '10px' }} message={`Bugün: ${todaysValue.format('DD-MM-YYYY')}`} />
      <Dropdown overlay={menu} trigger={['click']}>
        <Button type="primary">
          {choosenField}
        </Button></Dropdown>
      <Calendar value={value} onSelect={onSelect} onPanelChange={onPanelChange} dateCellRender={dateCellRender} />

    </>
  );
}




export default BookingCalendar;