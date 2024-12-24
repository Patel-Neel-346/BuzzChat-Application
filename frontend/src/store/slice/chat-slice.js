// export const createChatSlice=(set,get)=>({
//     selectedChatType:undefined,//select Either Contacts Or Channels
//     selectedChatData:undefined,//containes Actually Data Of Chats, User Data Like Email etc
//     selectedChatMessages:[],//array that containes chat Previos , it means old chats 


//     setSelectedChatType:(selectedChatType)=>set({selectedChatType}),//method of selectedChatType
//     setSelectedChatData:(selectedChatData)=>set({selectedChatData}),//method of selectedChatData
//     setSelectedChatMessages:(selectedChatMessages)=>set({selectedChatMessages}),//method of selectedChatMessasges

//     //for close chat when user close chat between contacts or channels
//     closeChat:()=>set({
//         selectedChatType:undefined,
//         selectedChatData:undefined,
//         selectedChatMessages:[],
//     }),

//     // function that add message into selectedChatMessage by Context or Channel

//     addMessage:(message)=>{
//         const selectedChatMessage=get().selectedChatMessage;
//         const selectedChatType=get().selectedChatType;

//         set({
//             selectedChatMessage:[
//                 ...selectedChatMessage,{
//                     ...message,
//                     recipient:
//                         selectedChatType==="channel"
//                         ? message.recipient
//                         : message.recipient._id,
//                     sender:
//                         selectedChatType==="channel"
//                         ? message.sender
//                         : message.sender._id,

//                 },
//             ],
//         });
//     },
// })

// export const createChatSlice = (set, get) => ({
//     selectedChatType: undefined, // select Either Contacts Or Channels
//     selectedChatData: undefined, // contains Actual Data Of Chats, User Data Like Email etc
//     selectedChatMessages: [], // array that contains chat Previous, it means old chats
  
//     setSelectedChatType: (selectedChatType) => set({ selectedChatType }), // method of selectedChatType
//     setSelectedChatData: (selectedChatData) => set({ selectedChatData }), // method of selectedChatData
//     setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }), // method of selectedChatMessages
  
//     // for close chat when user closes chat between contacts or channels
//     closeChat: () => set({
//       selectedChatType: undefined,
//       selectedChatData: undefined,
//       selectedChatMessages: [],
//     }),
  
//     // function that adds a message into selectedChatMessages by Context or Channel
//     addMessage: (message) => {
//       const selectedChatMessages = get().selectedChatMessages;
//       const selectedChatType = get().selectedChatType;
  
//       // Ensure the message is correctly structured
//       const updatedMessage = {
//         ...message,
//         recipient: selectedChatType === "channel" ? message.recipient : message.recipient._id,
//         sender: selectedChatType === "channel" ? message.sender : message.sender._id,
//       };
  
//       set({
//         selectedChatMessages: [
//           ...selectedChatMessages,
//           updatedMessage, // Add the new message to the existing messages
//         ],
//       });
//     },
//   });
// export const createChatSlice = (set, get) => ({
//     selectedChatType: undefined, // select Either Contacts Or Channels
//     selectedChatData: undefined, // contains Actual Data Of Chats, User Data Like Email, etc
//     selectedChatMessages: [], // array that contains chat Previous, old chats
  
//     setSelectedChatType: (selectedChatType) => set({ selectedChatType }), // method for selectedChatType
//     setSelectedChatData: (selectedChatData) => set({ selectedChatData }), // method for selectedChatData
//     setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }), // method for selectedChatMessages
  
//     // function to add message into selectedChatMessage
//     addMessage: (message) => {
//       const selectedChatMessages = get().selectedChatMessages;
//       const selectedChatType = get().selectedChatType;
  
//       set({
//         selectedChatMessages: [
//           ...selectedChatMessages,
//           {
//             ...message,
//             recipient:
//               selectedChatType === "channel"
//                 ? message.recipient
//                 : message.recipient._id,
//             sender:
//               selectedChatType === "channel"
//                 ? message.sender
//                 : message.sender._id,
//           },
//         ],
//       });
//     },
//   });
  
export const createChatSlice = (set, get) => ({
    selectedChatType: undefined,
    selectedChatData: undefined,
    selectedChatMessages: [], 
    directMessageContacts:[],
  
    setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
    setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
    setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
    setDirectMessageContacts:(directMessageContacts)=>set({directMessageContacts}),

    closeChat: () => set({
      selectedChatType: undefined,
      selectedChatData: undefined,
      selectedChatMessages: [],
    }),
  
    addMessage: (message) => {
      const selectedChatMessages = get().selectedChatMessages;
      set({ 
        selectedChatMessages: [...selectedChatMessages, { 
          ...message, 
          recipient: message.recipient._id,
          sender: message.sender._id
        }]
      });
    },
  });
  