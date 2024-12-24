// import { useAppStore } from "@/store";
// import { createContext, useContext, useEffect, useRef } from "react";
// import { io } from "socket.io-client";

// // Create a Context for Socket
// const SocketContext = createContext(null);

// // Custom hook to use Socket Context
// export const useSocket = () => {
//   return useContext(SocketContext);
// };

// // SocketProvider Component
// export const SocketProvider = ({ children }) => {
//   const socket = useRef(null); // Ref to hold the socket instance
//   const { userInfo } = useAppStore(); // Get user info from the store

//   useEffect(() => {
//     if (userInfo) {
//       // Initialize the socket connection
//       socket.current = io("http://localhost:8787", {
//         withCredentials: true,
//         query: { userId: userInfo.id },
//       });

//       // Log when connected
//       socket.current.on("connect", () => {
//         console.log("Connected To Socket Server");
//       });

//       const HandleMessage=(message)=>{
//         const {selectedChatType,selectedChatData,addMessage} =useAppStore()

//         if
//         (selectedChatType !==undefined &&  
//         (selectedChatData._id===message.sender._id ||
//         selectedChatData._id===message.recipient._id))
//         {
//           addMessage(message);
//           console.log({message})
//         }
           
//       }
//       socket.current.on("recieveMessage",HandleMessage);
//       // Cleanup on unmount or when `userInfo` changes
//       return () => {
//         if (socket.current) {
//           socket.current.disconnect();
//         }
//       };
//     }
//   }, [userInfo]);

//   // Always return the context provider
//   return (
//     <SocketContext.Provider value={socket.current}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
// // import { useAppStore } from "@/store";
// // import { useAppStore } from "@/store";
// // import { createContext, useContext, useEffect, useRef } from "react";
// // import { io } from "socket.io-client";

// // // Create a Context for Socket
// // const SocketContext = createContext(null);

// // // Custom hook to use Socket Context
// // export const useSocket = () => {
// //   return useContext(SocketContext);
// // };

// // // SocketProvider Component
// // export const SocketProvider = ({ children }) => {
// //   const socket = useRef(null); // Ref to hold the socket instance
// //   const { userInfo, selectedChatType, selectedChatData, addMessage } = useAppStore(); // Extract necessary store values

// //   useEffect(() => {
// //     // If no user is logged in, do nothing
// //     if (!userInfo) return;

// //     // Initialize a new socket connection
// //     console.log("🔌 Establishing Socket Connection...");
// //     socket.current = io("http://localhost:8787", {
// //       withCredentials: true,
// //       query: { userId: userInfo.id }, // Attach user ID as query param
// //     });

// //     // Event listener for when socket connects
// //     socket.current.on("connect", () => {
// //       console.log("✅ Connected to Socket Server");
// //     });

// //     // Handle incoming messages
// //     const handleMessage = (message) => {
// //       const { selectedChatType, selectedChatData } = useAppStore.getState(); // 🔥 Get the latest state
// //       console.log("📥 Incoming message:", message);

// //       // Check if the incoming message is for the currently selected chat
// //       if (
// //         selectedChatType !== undefined &&
// //         (selectedChatData?.contact._id === message.sender?._id ||
// //          selectedChatData?.contact._id === message.recipient?._id)
// //       ) {
// //         console.log("Message matches the selected chat! Adding to store...");
// //         addMessage(message); // Call addMessage to update the message list in the store
// //       } else {
// //         console.log("Message does not match the selected chat.");
// //       }
// //     };

// //     // Attach the message listener
// //     socket.current.on("receiveMessage", handleMessage);

// //     // Cleanup function to remove listeners and close socket
// //     return () => {
// //       if (socket.current) {
// //         console.log("🛑 Cleaning up socket...");
// //         socket.current.off("receiveMessage", handleMessage); // Remove event listener
// //         socket.current.disconnect(); // Close the socket
// //         socket.current = null; // Reset the ref
// //       }
// //     };
// //   }, [userInfo, selectedChatType, selectedChatData, addMessage]); // Re-run effect if these dependencies change

// //   return (
// //     <SocketContext.Provider value={socket.current}>
// //       {children}
// //     </SocketContext.Provider>
// //   );
// // };
import { createContext, useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAppStore } from "@/store/index.js";

const SocketContext = createContext(null);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
      
  const { userInfo,selectedChatData,selectedChatType,addMessage} = useAppStore();
 
  useEffect(() => {
    if (userInfo) {
      socket.current = io("http://localhost:8787", {
        withCredentials: true,
        query: { userId: userInfo.id },
      });
      socket.current.on("connect",()=>{
        console.log("Connected to server");
        // console.log("Connected to the Server");
      })

      const HandledRecieveMessage=(messageData)=>{
       
        // console.log(selectedChatData);
        console.log({messageData})
        addMessage(messageData);
      }
      socket.current.on("recievedMessage", HandledRecieveMessage);
      return () => {
        socket.current?.off("receiveMessage", HandledRecieveMessage); // Remove the listener
        socket.current?.disconnect(); // Close socket connection
      };
    }
  }, [userInfo]);
  

  return <SocketContext.Provider value={socket.current}>{children}</SocketContext.Provider>;
};
