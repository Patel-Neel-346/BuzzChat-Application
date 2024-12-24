import { useAppStore } from '@/store';
import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {IoArrowBack} from 'react-icons/io5'
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { colors, getColor } from '@/lib/utils';
import {FaTrash,FaPlus} from 'react-icons/fa'
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';
import { HOST } from '@/utiles/constants';


function Profile() {
  const Navigate=useNavigate();
  const {userInfo,setUserInfo}=useAppStore();
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [image,setImage]=useState(null);
  const [hovered,setHovered]=useState(false);
  const [selectedColor,setSelectedColor]=useState(0);

  const fileInputRef=useRef(null);

  useEffect(()=>{
    if(userInfo.profileSetup)
    {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.color);
      console.log({userInfo})
    }

    if(userInfo.image)
    {
      setImage(`http://localhost:8787/${userInfo.image}`);
    }
  },[])

  const validateProfile=()=>{
    if(!firstName.length)
      {
        toast.error("firstName is Required!");
        return false;
      }
      if(!lastName.length)
      {
        toast.error("lastName is Required!");
        return false;
      }
      return true;
  }
   
  const saveChange=async()=>{
    if(validateProfile())
    {
      const response = await apiClient.post(
        '/api/auth/user-Update',
        {
          firstName,
          lastName,
          color:selectedColor
        },
        {
          withCredentials:true
        }
      );
      if(response.status==200 && response.data)
      {
        setUserInfo(response.data);
        toast.success("Profile Updated SuccessFully.");
        Navigate('/Chat');
      }
      alert("Save")
    }
  }
  const handleNavigate=()=>{
    if(userInfo.profileSetup)
    {
      Navigate('/Chat');

    }else{
      toast.error("Please Setup Profile.");
    }
  }
  const handelFileInputClick=()=>{
    fileInputRef.current.click();
    // alert("done")
  }

  const handleImageChange=async(event)=>{
    const file=event.target.files[0];
    console.log({file});

    if(file){
      const fromdata=new FormData();
      fromdata.append('profile-image',file);
      console.log({fromdata})
      const respone=await apiClient.post(
        '/api/auth/add-Profile-Image',
        fromdata,
        {
          withCredentials:true,
        }
      );
      console.log({respone})

      if(respone.status==200 && respone.data.image)
      {
        setUserInfo({...userInfo, image: respone.data.image});
        toast.success("Image Updated SuccesFully");
      }

       const reader=new FileReader();
       reader.onload=()=>{
        setImage(reader.result);
       };
       reader.readAsDataURL(file);
    }

  }
  const deleteImage=async()=>{
    try{
      const respone = await apiClient.delete('/api/auth/remove-profile-image',{withCredentials:true});
      if(respone.status==200)
      {
        setUserInfo({...userInfo,image:null});
        toast.success("Image Removed SuccessFully");
        setImage(null);
      }
    }
    catch(error){
      console.log(error);
    }

  }


  return(
    
    <div className="bg-[#1b1c24] h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoArrowBack className='text-3xl lg:text-3xl text-white/90 cursor-pointer'/>
        </div>
        <div className="grid grid-cols-2">
          <div className="h-full w-32 md:w-48 md:h-48 relative flex items-center justify-center"
            onMouseEnter={()=>setHovered(true)}
            onMouseLeave={()=>setHovered(false)}>

              <Avatar className="h-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                  {image ? (
                    <AvatarImage 
                    src={image}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"/>
                  ):(
                    <div className={` uppercase h-32 w-32 md:w-48 md:h-48 text-5xl  flex items-center justify-center ${getColor(selectedColor)}`}>
                      {firstName 
                      ? firstName.split("").shift()
                      : userInfo.Email.split("").shift()}

                    </div>
                  )}

              </Avatar>
                  {
                    hovered && 
                  ( <div className="absolute  inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                  onClick={image ? deleteImage : handelFileInputClick }>
                      {
                        image ? 
                        (
                        <FaTrash className=' text-white text-2xl cursor-pointer' />
                        ):(
                        <FaPlus className=' text-white text-2xl cursor-pointer' />
                        ) 
                      }
                    </div>
                  )}
                  <Input
                   type="file"
                   name="profile-image"
                   ref={fileInputRef}
                   className="hidden"
                   onChange={handleImageChange}
                   accept=".png, .jpg, .jpeg, .svg, .webp" />

          </div>
                  <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center">
                    <div className="w-full">
                      <Input 
                      placeholder="Email"
                      type="email"
                      disbaled
                      value={userInfo.Email}
                      className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                      
                    </div>
                    <div className="w-full">
                      <Input 
                      placeholder="Enter Your First Name"
                      type="text"
                      value={firstName}
                      onChange={e=>setFirstName(e.target.value)}
                      className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                      
                    </div>
                    <div className="w-full">
                      <Input 
                      placeholder="Enter Your Last Name"
                      type="text"
                      value={lastName}
                      onChange={e=>setLastName(e.target.value)}
                      className="rounded-lg p-6 bg-[#2c2e3b] border-none" />
                      
                    </div>
                    <div className="w-full flex gap-10" >
                      {
                        colors.map((color,index)=>(
                          <div 
                          className={`${color } h-8 w-8 rounded-full cursor-pointer transition-all duration-300
                          ${selectedColor == index
                            ? "outline-white/50 outline-4 "
                            :" "
                          }`} key={index}
                          onClick={()=>setSelectedColor(index)}>

                          </div>
                        ))
                      }
                    </div>
                  </div>
        </div>
        <div className="w-full">
          <Button className="h-16 w-full bg-purple-600 hover:bg-purple-900 transition-all duration-300" onClick={saveChange}>Save Changes</Button>
        </div>
      </div>
    </div>
    // </div>
  )
}

export default Profile
