import React, { useRef, useState, useEffect } from "react";
import { GrAttachment } from "react-icons/gr"; // Attachment Icon
import { RiEmojiStickerLine } from "react-icons/ri"; // Emoji Picker Icon
import { IoSend } from "react-icons/io5"; // Send Icon
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "@/store";
import { useSocket } from "@/context/SocketContext";
import { Content } from "@radix-ui/react-dialog";
import { apiClient } from "@/lib/api-client";

const MessageBar = () => {
  const emojiRef = useRef(null); // Ref for emoji picker
  const fileInputref=useRef();
  const [message, setMessage] = useState(""); // State for input message
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false); // State for toggling emoji picker
  const {selectedChatType,selectedChatData,userInfo,selectedChatMessages ,setSelectedChatMessages} = useAppStore()
  const socket =useSocket()
 
  // Close emoji picker if clicked outside
  // useEffect(() => {
  //   const handleClickOutside = (event) => {
  //     if (emojiRef.current && !emojiRef.current.contains(event.target)) {
  //       setEmojiPickerOpen(false); // Close emoji picker
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside); // Add event listener
  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
  //   };
  // }, []);

  //  // Function to handle sending the message
  //  const handleSendMessage = async () => {
  //   if (message.trim() !== "") {
  //     console.log("Message Sent:", message);
  //     setMessage(""); // Clear the input
  //   } else {
  //     console.log("Cannot send empty message!");
  //   }
  //   console.log(selectedChatType)

  //   if(selectedChatType == "Contact")
  //   {
  //     socket.emit("sendMessage",{
  //       sender:userInfo.id,// user Id 
  //       content:message,//actully message 
  //       recipient:selectedChatData._id,//other user id that set in new_dom where we select in search bar
  //       messageType:"text",//type of data
  //       fileUrl:undefined,//undefined because we only send text message not file that why undefiend

  //     }, (error) => {
  //       console.log("Send Data SuccessFully")
  //       if (!error) {
  //         setMessage("");
  //         //  // Clear input only after successful send
  //       } else {
  //         console.error("Failed to send message:", error);
  //       }});
  //   }

  // };

  useEffect(()=>{
    const getMessage=async()=>{
      try {
        const respones=await apiClient.post('/api/getMessages/ContactChat',
          {id:selectedChatData._id},
          {withCredentials:true}
        );
        // console.log(respones);
        // console.log(respones.data.respones[1]._id)
        // console.log(respones.data.respones[2]._id)
        for (const i in respones.data.respones) {
          // console.log(respones.data.respones[i]._id)
          // console.log(respones.data.respones[i]);
          if(respones.data.respones[i]._id)
            {
              setSelectedChatMessages(respones.data.respones);
            }
        }
        
      } catch (error) {
        console.log(error);
      }
    }

    if(selectedChatData._id)
    {
      if(selectedChatType==="Contact")
      {
        getMessage();
      }
    }else{
      console.log("No User ID");
    }


  },[selectedChatData,selectedChatType,setSelectedChatMessages])

useEffect(() => {
  const handleClickOutside = (event) => {
    if (emojiRef.current && !emojiRef.current.contains(event.target)) {
      setEmojiPickerOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);

const handleSendMessage = async () => {
  if (message.trim() === "") {
    console.log("Cannot send empty message!");
    return;
  }
  console.log({selectedChatMessages})
  console.log("Message Sent:", message);
  setMessage(""); 
  let recipientId=selectedChatData._id;
  console.log(recipientId);
  if (selectedChatType === "Contact") {
    socket.emit("sendMessage", {
      sender: userInfo.id,
      content: message,
      recipient: recipientId,
      messageType: "text",
      fileUrl: undefined, 
    }, (error) => {
      if (!error) {
        setMessage(""); 
      } else {
        console.error("Failed to send message:", error);
      }
    });
  }
};

const handleAttachmentClick=()=>{
  if(fileInputref.current)
  {
    fileInputref.current.click();
  }
}

const handleAttachmentChange=async(event)=>{
  try {
    const file=event.target.files[0];

    if(file)
    {
      const formData=new FormData();
      formData.append("file",file);
      const respones=await apiClient.post('/api/getMessages/upload-file',formData,{withCredentials:true});

      console.log("File:",respones)

      if(respones.status==200 && respones.data)
      {
        if(selectedChatType=="Contact")
        {
          socket.emit("sendMessage", {
            sender: userInfo.id,
            content: respones.data.content,
            recipient: selectedChatData._id,
            messageType: "file",
            // fileUrl: undefined, 
          }, (error) => {
            if (!error) {
              setMessage(""); 
            } else {
              console.error("Failed Send Files:", error);
            }
          });
        }
      }
    }

    console.log({file});
  } catch (error) {
    console.log("File Error:",error)
  }
}
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      {/* Input Section */}
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        {/* Attachment Icon */}
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
         onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>
        <input type="file" className="hidden" ref={fileInputref} onChange={handleAttachmentChange} />
         {/* Emoji Picker Section */}
      <div className="relative">
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
        >
          <RiEmojiStickerLine className="text-2xl" />
        </button>
        {emojiPickerOpen && (
          <div
            ref={emojiRef}
            className="absolute bottom-16 right-0 bg-[#2a2b33] p-3 rounded-lg shadow-lg"
          >
            <p className="text-white text-sm">
            {emojiPickerOpen && (
                    <div ref={emojiRef} className="absolute bottom-16 right-0 bg-[#2a2b33] p-3 rounded-lg shadow-lg">
                        <EmojiPicker theme="dark" onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)} />
                    </div>
                    )}
            </p>
          </div>
        )}
      </div>
      </div>

     

      {/* Send Button */}
      <button
        className="bg-[#8411ff] rounded-md flex items-center justify-center p-5 focus:border-none hover:bg-[#741bda] focus:bg-[#741bda] focus:outline-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;


// import React, { useRef, useState, useEffect } from "react";
// import { RiEmojiStickerLine } from "react-icons/ri"; // Emoji Picker Icon
// import { IoSend } from "react-icons/io5"; // Send Icon
// import EmojiPicker from "emoji-picker-react";
// import { useAppStore } from "@/store";
// import { useSocket } from "@/context/SocketContext";
// import { toast } from "sonner"; // For success and error notifications

// const MessageBar = () => {
//   const emojiRef = useRef(null); // Ref for emoji picker
//   const [message, setMessage] = useState(""); // State for input message
//   const [emojiPickerOpen, setEmojiPickerOpen] = useState(false); // State for toggling emoji picker
//   const { selectedChatType, selectedChatData, userInfo } = useAppStore();
//   const socket = useSocket();

//   // Close emoji picker if clicked outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (emojiRef.current && !emojiRef.current.contains(event.target)) {
//         setEmojiPickerOpen(false); // Close emoji picker
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside); // Add event listener
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside); // Cleanup on unmount
//     };
//   }, []);

//   // Function to handle sending the message
//   const handleSendMessage = async () => {
//     const messageContent = message.trim(); // Trim leading/trailing whitespace
//     if (!messageContent) {
//       console.warn("Cannot send an empty message!"); // Prevent sending empty messages
//       return;
//     }

//     setMessage(""); // Clear the input immediately
   
//     if (selectedChatType === "Contact") {
//       if (!selectedChatData.contact || !selectedChatData.contact._id) {
//         console.error("Recipient is missing! Check if selectedChatData._id is set.", selectedChatData);
//         toast.error("Recipient is missing. Please try again.");
//         return;
//       }

//       socket.emit(
//         "sendMessage",
//         {
//           sender: userInfo.id,
//           recipient: selectedChatData.contact._id,
//           content: messageContent,
//           messageType: "text",
//           fileUrl: undefined, // Undefined because this is a text-only message
//         },
//         (error) => {
//           if (error) {
//             console.error("Failed to send message:", error);
//             toast.error("Failed to send message. Please try again.");
//             setMessage(messageContent); // Restore message if sending fails
//           } else {
//             toast.success("Message successfully sent!");
//           }
//         }
//       );
//     }
//   };

//   return (
//     <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
//       {/* Input Section */}
//       <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
//         <textarea
//           className="flex-1 p-5 bg-transparent rounded-md text-white placeholder-neutral-400 focus:outline-none resize-none h-full"
//           placeholder="Type your message here..."
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//               e.preventDefault(); // Prevent default form submission
//               handleSendMessage();
//             }
//           }}
//         />

//         {/* Emoji Picker Section */}
//         <div className="relative">
//           <button
//             className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
//             onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}
//           >
//             <RiEmojiStickerLine className="text-2xl" />
//           </button>
//           {emojiPickerOpen && (
//             <div
//               ref={emojiRef}
//               className="absolute bottom-16 right-0 bg-[#2a2b33] p-3 rounded-lg shadow-lg"
//             >
//               <EmojiPicker
//                 theme="dark"
//                 onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Send Button */}
//       <button
//         className="bg-[#8411ff] hover:bg-[#741bda] rounded-md flex items-center justify-center p-5 focus:ring-4 ring-[#8411ff] focus:outline-none transition-all"
//         onClick={handleSendMessage}
//       >
//         <IoSend className="text-2xl" />
//       </button>
//     </div>
//   );
// };

// export default MessageBar;


// import React, { useRef, useState, useEffect } from "react";
// import { GrAttachment } from "react-icons/gr"; 
// import { RiEmojiStickerLine } from "react-icons/ri"; 
// import { IoSend } from "react-icons/io5"; 
// import EmojiPicker from "emoji-picker-react";
// import { useAppStore } from "@/store";
// import { useSocket } from "@/context/SocketContext";

// const MessageBar = () => {
//   const emojiRef = useRef(null); 
//   const [message, setMessage] = useState(""); 
//   const [emojiPickerOpen, setEmojiPickerOpen] = useState(false); 
//   const { selectedChatType, selectedChatData, userInfo,selectedChatMessages } = useAppStore();
//   const socket = useSocket();

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (emojiRef.current && !emojiRef.current.contains(event.target)) {
//         setEmojiPickerOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   const handleSendMessage = async () => {
//     if (message.trim() === "") {
//       console.log("Cannot send empty message!");
//       return;
//     }
//     console.log({selectedChatMessages})
//     console.log("Message Sent:", message);
//     setMessage(""); 
//     let recipientId=selectedChatData.contact._id;
//     console.log(recipientId);
//     if (selectedChatType === "Contact") {
//       socket.emit("sendMessage", {
//         sender: userInfo.id,
//         content: message,
//         recipient: recipientId,
//         messageType: "text",
//         fileUrl: undefined, 
//       }, (error) => {
//         if (!error) {
//           setMessage(""); 
//         } else {
//           console.error("Failed to send message:", error);
//         }
//       });
//     }
//   };

//   return (
//     <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
//       <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
//         <input
//           type="text"
//           className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
//           placeholder="Enter Message"
//           value={message}
//           onChange={(e) => setMessage(e.target.value)}
//         />
//         <button className="text-neutral-500" onClick={() => setEmojiPickerOpen(!emojiPickerOpen)}>
//           <RiEmojiStickerLine className="text-2xl" />
//         </button>
//         {emojiPickerOpen && (
//           <div ref={emojiRef} className="absolute bottom-16 right-0 bg-[#2a2b33] p-3 rounded-lg shadow-lg">
//             <EmojiPicker theme="dark" onEmojiClick={(emoji) => setMessage((prev) => prev + emoji.emoji)} />
//           </div>
//         )}
//         <button className="bg-[#8411ff] rounded-md p-5" onClick={handleSendMessage}>
//           <IoSend className="text-2xl" />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default MessageBar;
