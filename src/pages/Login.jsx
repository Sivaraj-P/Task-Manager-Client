import React, { useState } from 'react';
import { Button, Card, Alert, Label, TextInput } from 'flowbite-react';
import axios from 'axios';
import { BASE_URL } from '../App'; 
import { useNavigate } from 'react-router-dom';

const Login = ({ handleUser }) => {
  const [phone_number, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {

    if (!phone_number || !password) {
      setError('Phone number and password are required.');
      return; 
    }

    try {
      const response = await axios.post(`${BASE_URL}/login`, {
        phone_number,
        password,
      });

      handleUser(JSON.stringify(response.data));
      navigate('/tasks');
    } catch (err) {
      console.log(err);
      setError('Invalid login credentials. Please try again.');
    }
  };


  return (
    // <div className='h-screen w-full flex col justify-between gap-3 items-center'>
      <div className='h-screen flex justify-center items-center'>

        <Card className="w-1/3">
      <p className='text-cyan-700 font-bold text-center text-xl'>Task Manager</p>

          <div>
            <div className="mb-2 block">
              <Label htmlFor="phone_number" value="Your Phone Number" />
            </div>
            <TextInput
              id="phone_number"
              type="number"
              placeholder=""
              required
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Your password" />
            </div>
            <TextInput
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <Alert color="failure">
              {error}
            </Alert>
          )}
          <Button type="submit" onClick={handleSubmit}>Login</Button>
        </Card>
      {/* </div> */}
    </div>
  );
};

export default Login;
