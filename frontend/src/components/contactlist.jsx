

import { useAppStore } from '@/store'
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar';
import { getColor } from '@/lib/utils';

const ContactList = ({ Contacts = [], isChannel = false }) => {
  const { 
    selectedChatData, 
    setSelectedChatData, 
    selectedChatType, 
    setSelectedChatType, 
    setSelectedChatMessages 
  } = useAppStore();
  // console.log(selectedChatData);
  const handleClick = (contact) => {
    const isNewChat = !selectedChatData || selectedChatData._id !== contact._id;
    
    setSelectedChatType(isChannel ? "Channel" : "Contact");
    setSelectedChatData(contact);

    if (isNewChat) {
      setSelectedChatMessages([]);
    }
  };

  return (
    <div className='mt-5'>
      {Contacts.map((contact) => (
        <div 
          className={`pl-10 py-2 transition-all duration-300 cursor-pointer ${selectedChatData && (selectedChatData._id===contact._id) ? "bg-[#8417ff] hover:bg-[#8417ff]":"hover:bg-[#f1f1f111]"}`} 
          key={contact._id} 
          onClick={() => handleClick(contact)}
        >
          {/* {contact.firstName} */}
        <div className='flex gap-5 items-center justify-start text-neutral-300'>
          {
            !isChannel &&  <Avatar className="h-10 w-10  rounded-full overflow-hidden">
                                        {contact.image ? (
                                          <AvatarImage 
                                            src={`http://localhost:8787/${contact.image}`} 
                                            alt="Profile" 
                                            className="object-cover w-full h-full bg-black" 
                                          />
                                        ) : (
                                          <div className={`uppercase h-12 w-12  text-lg flex items-center justify-center ${getColor(contact.color)}`}>
                                            {contact.firstName 
                                              ? contact.firstName
                                              : contact.Email
                                            }
                                          </div>
                                        )}
                                      </Avatar>
          }
          {
            isChannel && <div className='bg-[#ffffff22] h-10 w-10 flex items-center justify-center rounded-full'>#</div>
           }
           {
            isChannel ? <span>{contact.firstName}</span> : <span>{`${contact.firstName} ${contact.lastName}`}</span>
           }
        </div>

        </div>
      ))}
    </div>
  )
}

export default ContactList;
