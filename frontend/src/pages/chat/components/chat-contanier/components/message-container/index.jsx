
import { useAppStore } from '@/store';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import {MdFolderZip} from 'react-icons/md'
import { FaCloudDownloadAlt } from "react-icons/fa";
import { IoIosCloseCircle } from "react-icons/io";
import { apiClient } from '@/lib/api-client';


const MessageContainer = () => {
  const scrollRef = useRef();
  const { selectedChatType, selectedChatData, selectedChatMessages, userInfo } = useAppStore();
  const [showImage,setShowImage]=useState(false)
  const [imageUrl,setImageUrl]=useState(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedChatMessages]);

  const checkIfImage=(filePath)=>{
    const imageRegx=
    /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|heic|geif|ico)$/i;
    return imageRegx.test(filePath);
  }
  const downloadFile=async(file)=>{
    const respones=await apiClient.get(`http://localhost:8787/${file}`,{
      responseType:"blob",
    })
    const urlBlob=window.URL.createObjectURL(new Blob([respones.data]));
    const link=document.createElement("a");
    link.href=urlBlob;
    link.setAttribute("download",file.split('/').pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
  }
  const renderMessages = () => {
    let lastDate = null;

    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format('YYYY-MM-DD');
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;

      return (
        <div key={message.id || index}>
          {showDate && (
            <div className="text-center text-gray-500 my-2">
              {moment(message.timestamp).format('LL')}
            </div>
          )}
          {selectedChatType === 'Contact' && renderDMMessage(message)}
        </div>
      );
    });
  };


  const renderDMMessage = (message) => {
    const isSentByContact = message.sender === selectedChatData._id;

    return (
      <div className={`${isSentByContact ? 'text-left' : 'text-right'}`} key={message.id}>
        {message.messageType === 'text' && (
          <div
            className={`${
              isSentByContact
                ? 'bg-[#2a2b33]/5 text-white/80 border-white/20'
                : 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}
          </div>
        )}
         {message.messageType === 'file' && (
          <div
            className={`${
              isSentByContact
                ? 'bg-[#2a2b33]/5 text-white/80 border-white/20'
                : 'bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50'
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {
              checkIfImage(message.content) ? <div className='cursor-pointer'>
                <img
                src={`http://localhost:8787/${message.content}`} height={400} width={400} onClick={()=>{
                  setShowImage(true)
                  setImageUrl(message.content)
                }} />
              </div>:<div className='flex items-center justify-center gap-4'>
                <span className='text-white text-3xl bg-black/20 rounded-full p-3'>
                <MdFolderZip />
                </span>
                <span>
                  {
                    message.content.split('/').pop()
                  }
                </span>
                <span className='bg-black/20 p-3 text-3xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300' onClick={()=>downloadFile(message.content)}>
                  <FaCloudDownloadAlt  />
                </span>
              </div>
            }
          </div>
        )}
        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format('LT')}
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full">
      {renderMessages()}
      <div ref={scrollRef} />
      {
        showImage && <div className='fixed z-[1000] top-0 left-0 h-[100vh] w-full flex items-center justify-center backdrop-blur-lg flex-col'>
          <div>
            <img src={`http://localhost:8787/${imageUrl}`}  className="h-[80vh] w-full bg-cover " alt="Image" />
          </div>
          <div className='flex gap-5 fixed top-0 mt-5'>
            <button className='bg-black/20 p-3 text-3xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
            onClick={()=>downloadFile(imageUrl)}>
              <FaCloudDownloadAlt  />
            </button>
            <button className='bg-black/20 p-3 text-3xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300'
            onClick={()=>{
              setShowImage(false)
              setImageUrl(null)}}>
              <IoIosCloseCircle />
            </button>
          </div>
        </div>
      }
    </div>
  );
};

export default MessageContainer;
