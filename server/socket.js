// // import { disconnect } from "mongoose";
// import {Server as SocketIOServer} from "socket.io";
// import Message from "./models/messagesModel.js";

// const setupSocket=(server)=>{
//     //create IO(input/output) server and link with originserver means upgrade you reqest to normal Http get To WS(websocket) request
//     const io=new SocketIOServer(server,{
//         cors:{
//             origin:process.env.ORIGIN,
//             methods:["GET","POST"],
//             credentials:true,
//         },
//     });

//     //create Map instance that use for map userID And SocketId

//     const userSocketMap=new Map();

//     //function for disconnect
//     const disconnect=(socket)=>{
//         console.log(`Client Disconnected:${socket.id}`);
//         for(const [userId,SocketId] of userSocketMap.entries()){
//             if(SocketId===socket.id)
//             {
//                 userSocketMap.delete(userId);
//                 break;
//             }
//         }
//     }

//     //function for send the message
//     const  sendMessage=async(message)=>{
//         const senderSocketId=userSocketMap.get(message.sender);
//         const recipientSocketId=userSocketMap.get(message.recipient);

//         const createMessage=await Message.create(message);

//         const messageData=await Message.findById(createMessage._id)
//         .populate("sender","id Email firstName lastName image color")
//         .populate("recipient","id Email firstName lastName image color");

//         if(recipientSocketId)
//         {
//             io.to(recipientSocketId).emit("recieveMessage",messageData);
//         }
//         if(senderSocketId)
//         {
//             io.to(senderSocketId).emit("recieveMessage",messageData);

//         }
//     }

//     //create connection 
//     io.on("connection",(socket)=>{
//         const userId=socket.handshake.query.userId;

//         if(userId)
//         {
//             userSocketMap.set(userId,socket.id);
//             console.log(`User Connected:${userId} with SocketId:${socket.id}`);
//         }
//         else
//         {
//             console.log("User Id Not Provided During Connection..");
//         }
//         socket.on("sendMessage",sendMessage);
//         socket.on("disconnect",()=>disconnect(socket));
//     })

// }
// export default setupSocket;


// //   // Function to send a message
// //   const sendMessage = async (message) => {
// //     try {
// //       const { sender, recipient, content, messageType } = message;

// //       // Check for required fields (allow group messages without recipient)
// //       if (!sender || !content) {
// //         console.error("Invalid message structure", message);
// //         return;
// //       }

// //       if (!recipient && messageType !== 'group') {
// //         console.error("Recipient is missing for 1-to-1 message:", message);
// //         return;
// //       }

// //       const senderSocketId = userSocketMap.get(sender);
// //       const recipientSocketId = userSocketMap.get(recipient);

// //       // Create and save the message to the database
// //       const createMessage = await Message.create(message);
// //       await createMessage.save();

// //       // Fetch the saved message with populated sender and recipient data
// //       const messageData = await Message.findById(createMessage._id)
// //         .populate("sender", "id Email firstName lastName image color")
// //         .populate("recipient", "id Email firstName lastName image color");

// //       console.log(messageData);

// //       // Send the message to the recipient if online
// //       if (recipientSocketId) {
// //         io.to(recipientSocketId).emit("receiveMessage", messageData);
// //       }

// //       // Send the message back to the sender if online
// //       if (senderSocketId) {
// //         io.to(senderSocketId).emit("receiveMessage", messageData);
// //       }

// //       // If it's a group message, broadcast to all recipients
// //       if (messageType === 'group' && message.recipients) {
// //         message.recipients.forEach((recipientId) => {
// //           const recipientSocketId = userSocketMap.get(recipientId);
// //           if (recipientSocketId) {
// //             io.to(recipientSocketId).emit("receiveMessage", messageData);
// //           }
// //         });
// //       }

// //     } catch (error) {
// //       console.error("Error sending message:", error);
// //     }
// //   };

// //   // Create connection
// //   io.on("connection", (socket) => {
// //     const userId = socket.handshake.query.userId;

// //     if (userId) {
// //       // Check if userId is already connected with a different socket
// //       if (userSocketMap.has(userId)) {
// //         const oldSocketId = userSocketMap.get(userId);
// //         if (oldSocketId !== socket.id) {
// //           console.log(`User ${userId} reconnected. Removing old socket ${oldSocketId}.`);
// //           userSocketMap.delete(userId);
// //         }
// //       }

// //       // Associate userId with the new socket ID
// //       userSocketMap.set(userId, socket.id);
// //       console.log(`User Connected: ${userId} with SocketId: ${socket.id}`);
// //     } else {
// //       console.warn("User Id Not Provided During Connection. Closing connection.");
// //       socket.emit("error", "User ID not provided, closing connection.");
// //       socket.disconnect(true);
// //       return;
// //     }

// //     // Listen for incoming messages and process them
// //     socket.on("sendMessage", async (message) => await sendMessage(message));

// //     // Handle disconnection
// //     socket.on("disconnect", () => handleDisconnect(socket));
// //   });
// // };

// // export default setupSocket;

import { Server as SocketIOServer } from "socket.io";
import Message from "./models/messagesModel.js";

const setupSocket = (server) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  const userSocketMap = new Map();

  const disconnect = (socket) => {
    console.log(`Client Disconnected: ${socket.id}`);
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
  };

  const sendMessage = async (message) => {
    try {
      const createMessage = await Message.create(message);
      const messageData = await Message.findById(createMessage._id)
        .populate("sender", "id Email firstName lastName image color")
        .populate("recipient", "id Email firstName lastName image color");
        // console.log(message.sender)
        // console.log(message.)
      const senderSocketId = userSocketMap.get(message.sender);
      const recipientSocketId = userSocketMap.get(message.recipient);

      console.log("Sender:",senderSocketId)
      console.log("recipient:",recipientSocketId);
      console.log("text:",messageData);

      if (recipientSocketId)
      {
        io.to(recipientSocketId).emit("recievedMessage", messageData);
        console.log("data Send SuccessFully");
      }
      else
      {
        console.log("data Is Not Send SuccSfully");
      }
      if (senderSocketId){ 
        io.to(senderSocketId).emit("recievedMessage", messageData);
        console.log("data Send SuccessFully");
      }
      else
      {
        console.log("data Is Not Send SuccSfully");
      }

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User Connected: ${userId} with SocketId: ${socket.id}`);
    }
    socket.on("sendMessage", sendMessage);
    socket.on("disconnect", () => disconnect(socket));
  });
};

export default setupSocket;

