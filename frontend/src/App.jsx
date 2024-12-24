import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Auth from './pages/auth'
import Chat from './pages/chat'
import Profile from './pages/profile'
import { useAppStore } from './store/index.js'
import { useEffect } from 'react'
import { Cookie, ThermometerSnowflakeIcon } from 'lucide-react'
import { apiClient } from './lib/api-client'

const PrivateRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;

  return isAuthenticated ? children : <Navigate to="/Auth" />;
};

// Route for protecting the /Auth page from already logged-in users
const AuthRoute = ({ children }) => {
  const { userInfo } = useAppStore();
  const isAuthenticated = !!userInfo;

  return isAuthenticated ? <Navigate to="/Chat" /> : children;
};




function App() {
  const { userInfo , setUserInfo } = useAppStore();
  const [ loading , setLoading ]=useState(true);
  // const token=cookies.get('jwt');
  // const Navigate=useNavigate();
  const getCookieValue = (cookieName) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));
    return cookie ? cookie.split('=')[1] : null;
  };
  
  useEffect(()=>{
    const getUserData=async()=>{

      try{
        const response=await apiClient.get(
          '/api/auth/user-Info',
          {
            withCredentials:true,
          }
        );
        
        if(response.status===200 && response.data.id)
        {
          setUserInfo(response.data);
          // console.log(userInfo)s
        }
        else{
          setUserInfo(undefined);
        }
          
        console.log({response});
      }
      catch(error)
      {
        console.log({error})
        setUserInfo(undefined);
      }
      finally{
        setLoading(false);
      }
    }
    const token = getCookieValue('jwt'); // Get the 'token' cookie
    console.log('JWT Token from Cookie:', token);
    // if (!token) {
    //   // No token, so redirect to the Auth page
    //   return <Navigate to="/Auth" />;
    // }
    // if (loading) {
    //   // Token exists but user data is being fetched
    //   return <div>Loading...</div>;
    // }
    if(!userInfo)
    {
      getUserData();
    }
    else{
      setLoading(false);
    }
  },[userInfo,setUserInfo])

  if(loading)
  {
    return(
      <>
      <div>Loading...</div>
      </>
    )
  }

  // if(Request.cookies.jwt)
  // {
  //   alert("Token Exist");
  // }
 
  

  

  return (
  <>
  <BrowserRouter>
  <Routes>
    <Route path='/Auth' element={
       <AuthRoute>
      <Auth/>
       </AuthRoute>
    }>
    </Route>
    <Route path='/Chat' element={
       <PrivateRoute>
        <Chat/>
       </PrivateRoute>
      }></Route>
    <Route path='/Profile' element={
      <PrivateRoute>
        <Profile/>
      </PrivateRoute>
    }></Route>
    <Route path='*' element={<Navigate to="/Auth"/>}></Route>

  </Routes>
  </BrowserRouter>
 </>
  )
}

export default App
