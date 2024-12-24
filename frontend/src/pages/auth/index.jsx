import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import Background from '../../assets/login2.png';
import Victory from '../../assets/victory.svg';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
// import apiClient from '@/lib/api-client';
import {  SIGNUP_ROUTES } from '@/utiles/constants';
import {apiClient} from "@/lib/api-client.js";
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/index.js';

const Auth = () => {
  
  const Navigate=useNavigate()
  const {setUserInfo } = useAppStore();

  const [Email,Setemail]=useState("");
  const [Password,Setpassword]=useState("");
  const [Confirmpassword,Setconfirmpassword]=useState("");
  
  
  const validateLogin=()=>{
    if(!Email.length)
      {
        toast.error("Email is Required!");
        return false;
      }
      if(!Password.length)
      {
        toast.error("Password is Required!");
        return false;
      }
      // if(!Confirmpassword.length)
      // {
      //   toast.error("Confirm Password is Required!");
      //   return false;
      // }
      // if(Password !== Confirmpassword)
      // {
      //   toast.error("Password And Confirm Password Should Be Same!!!");
      //   return false;
      // }
      return true;

  }
  const validate=()=>{
    if(!Email.length)
    {
      toast.error("Email is Required!");
      return false;
    }
    if(!Password.length)
    {
      toast.error("Password is Required!");
      return false;
    }
    if(!Confirmpassword.length)
    {
      toast.error("Confirm Password is Required!");
      return false;
    }
    if(Password !== Confirmpassword)
    {
      toast.error("Password And Confirm Password Should Be Same!!!");
      return false;
    }
    return true;
  }

  const handleLogin = async () => {
    if (validateLogin()) {
      try {
        // Perform the API call
        const response = await apiClient.post(
          "/api/auth/login",
          { Email, Password },
          { withCredentials: true }
        );
        
        // Check if the user ID exists
        if (response.data?.user?.id) {
          setUserInfo(response.data.user);
          // response.data.user.profileSetup=true;
          if (response.data.user.profileSetup) {
            Navigate('/Chat');
            // <Link to='/Chat'/>
          } else {
            // <Link to='/Profile'/>

            Navigate('/Profile');
          }
          alert("Login Done!");
        } else {
          alert("Login failed: User ID not found.");
        }
      } catch (error) {
        // Handle potential errors
        console.error("Login error:", error);
        alert("An error occurred during login. Please try again.");
      }
    }
  };
  

  const handleRegistor = async () => {
    if (validate()) {
      try {
        // Perform the API call
        const response = await apiClient.post(
          "/api/auth/signup",
          { Email, Password },
          { withCredentials: true }
        );
        console.log(response);
        // Check if the status is 201 (Created)
        if (response.status == 201) {
          setUserInfo(response.data.user);
          Navigate('/Profile');

          alert("Data Inserted!");
        } else {
          alert("Registration failed. Please try again.");
        }
      } catch (error) {
        // Handle potential errors
        console.error("Registration error:", error);
        alert("An error occurred during registration. Please try again.");
      }
    }
  };
  

  // const handleRegistor=async()=>{
  //   if(validate()){
  //     await apiClient.post(SIGNUP_ROUTES,{Email,Password}).then(data=>console.log(data));
  //     alert("DATA INSERTED!");
  //   }
  // }

  // const handleRegistor = async () => {
  //   if(validate()){
  //   const response = await fetch("http://localhost:8787/api/auth/signup", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ Email, Password }),
  //   });
  //   const data = await response.json();
  //   console.log(data);
  // }
  // };
  
  return (
    <div className="w-[100vw] h-[100vh] flex items-center justify-center">
      <div className='h-[80vh] bg-white border-2 border-white text-orange-90 shadow-2xl w-[80vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] rounded-3xl grid xl:grid-cols-2'>
        <div className="flex flex-col gap-10 items-center">
          <div className="flex items-center justify-center flex-col">
            <div className="flex items-center justify-center ">
              <h1 className="text-5xl font-bold md:text-6xl">Welcome</h1>
              <img src={Victory} alt="Victory Img" className="h-[100px]" />
            </div>
            <p className="font-medium text-center"> Fill In The Details To Get Started With Best Chat App!</p>
          </div>
          <div className="fle itec jusc w-full">
            <Tabs defaultValue="Login" className="w-full">
              <TabsList className="bg-transparent rounded-none w-full">
                <TabsTrigger value="Login" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Login</TabsTrigger>
                <TabsTrigger value="Registor" className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300">Registor</TabsTrigger>
              </TabsList>
              <TabsContent value="Login" className="flex flex-col gap-5 mt-5 ">
                <Input
                placeholder="Enter Your Email"
                type="email"
                className="rounded-full p-6 "
                value={Email}
                onChange={(e)=>Setemail(e.target.value)}
                />
                <Input
                placeholder="Enter Your Password"
                type="password"
                className="rounded-full p-6 "
                value={Password}
                onChange={(e)=>Setpassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleLogin}> Login</Button>
                
              </TabsContent>
              <TabsContent value="Registor" className="flex flex-col gap-5 " >
              <Input
                placeholder="Enter Your Email"
                type="email"
                className="rounded-full p-6 "
                value={Email}
                onChange={(e)=>Setemail(e.target.value)}
                />
                <Input
                placeholder="Enter Your Password"
                type="password"
                className="rounded-full p-6 "
                value={Password}
                onChange={(e)=>Setpassword(e.target.value)}
                />
                <Input
                placeholder="Confirm Password"
                type="password"
                className="rounded-full p-6 "
                value={Confirmpassword}
                onChange={(e)=>Setconfirmpassword(e.target.value)}
                />
                <Button className="rounded-full p-6" onClick={handleRegistor}> Registor</Button>
                
              </TabsContent>
            </Tabs>

          </div>
        </div>
        <div className="hidden xl:flex justify-center items-center">
          <img src={Background} alt="" className="h=[700px]" />
        </div>
      </div>
    </div>
  )
}

export default Auth
