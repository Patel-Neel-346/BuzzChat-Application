import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { getColor } from '@/lib/utils'
import { useAppStore } from '@/store'
import React from 'react'
import { FiEdit2 } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import {IoPowerSharp} from 'react-icons/io5'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
const ProfileInfo = () => {
  const Navigate=useNavigate()
  const {userInfo,setUserInfo} = useAppStore()
  console.log({userInfo})

  const UserLogout=async()=>{
    try{
    const respone=await apiClient.post('/api/auth/Logout',{},{withCredentials:true});

    if(respone.status==200)
    {
      setUserInfo(null);
      toast.success("Logout SuccessFully.");
      Navigate("/Auth");
    }

    }
    catch(error)
    {
      console.log(error)
    }
  }
  return (
    <div className="absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]">
      <div className="flex gap-3 items-center justify-center">
        <div className="w-12 h-12 relative">
      <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                  {userInfo.image ? (
                    <AvatarImage 
                    src={`http://localhost:8787/${userInfo.image}`}
                    alt="Profile"
                    className="object-cover w-full h-full bg-black"/>
                  ):(
                    <div className={` uppercase h-12 w-12  text-lg  flex items-center justify-center ${getColor(userInfo.color)}`}>
                      {userInfo.firstName 
                      ? userInfo.firstName.split("").shift()
                      : userInfo.Email.split("").shift()}
                      
                    </div>
                  )}

              </Avatar>
        </div>
          <div>
            {
              userInfo.firstName && userInfo.lastName ? `${userInfo.firstName} ${userInfo.lastName}`: " "
            }
          </div>
      </div>
      <div className="flex gap-5">
      <TooltipProvider>
        <Tooltip>
        <TooltipTrigger>
        <FiEdit2 className='text-purple-500 text-xl font-medium hover:cursor-pointer'
        onClick={()=>Navigate('/Profile')}/>
        </TooltipTrigger>
         
          <TooltipContent className='bg-[#1c1b1e] border-none p-3 mb-3 text-white'>
            <p >Edit User Profile</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
        <TooltipTrigger>
        <IoPowerSharp className='text-red-500 text-xl font-medium hover:cursor-pointer'
        onClick={UserLogout}/>
        </TooltipTrigger>
         
          <TooltipContent className='bg-[#1c1b1e] border-none p-3 mb-3 text-white'>
            <p >LogOut</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      </div>
    </div>
  )
}

export default ProfileInfo
