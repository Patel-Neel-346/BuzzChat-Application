import React, { useState,useEffect} from 'react'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "@/components/ui/tooltip"
import { FaPlus } from 'react-icons/fa'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from '@/components/ui/input'
import Lottie from 'react-lottie'
import { animationDefaultOptions, getColor } from '@/lib/utils'
import { apiClient } from '@/lib/api-client'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useAppStore } from '@/store'
  

const NewDm = () => {
    const [openNewContactModel,setOpenNewContactModel]=useState(false);
    // const [SearchedContacts,setSearchedContacts]=useState([]);
    const [SearchedContacts, setSearchedContacts] = useState([]); // Ensure initial state is always an array
    const [loading, setLoading] = useState(false); // Loading state to prevent UI crashes
    const {
      selectedChatType,
      selectedChatData,
      selectedChatMessages,
      setSelectedChatType,
      setSelectedChatData,
      setSelectedChatMessages,
      closeChat
    } = useAppStore()

    // const SearchContacts=async(Search)=>{
    //     try{
    //         if(Search.length>0)
    //         {
    //             const respone=await apiClient.post("/api/contacts/search",{Search},{withCredentials:true});
    //             console.log({respone});
    //             if(respone.status==200 && respone.data.Contacts)
    //             {
    //                 setSearchedContacts(respone.data.Contacts)
    //             }

    //         }else{
    //             setSearchedContacts([]);
    //         }
    //     }
    //     catch(error)
    //     {
    //         console.log(error)
    //     }
    // }
    const SearchContacts = async (Search) => {
        try {
          if (Search.length > 0) {
            setLoading(true); // Start loading
            const response = await apiClient.post("/api/contacts/search", { Search }, { withCredentials: true });
            console.log('API Response:', response);
    
            // Check if the response is correct and contains contacts
            if (response.status === 200 && Array.isArray(response.data.Contacts)) {
              setSearchedContacts(response.data.Contacts);
            } else {
              setSearchedContacts([]); // Empty the contacts if no data
            }
          } else {
            setSearchedContacts([]); // Empty the contacts if no search term
          }
        } catch (error) {
          console.error('Error fetching contacts:', error);
          setSearchedContacts([]); // Handle errors by clearing the contacts
        } finally {
          setLoading(false); // End loading
        }
      };
      const selectNewContact=(contact)=>{
        setOpenNewContactModel(false)
        setSelectedChatType("Contact");
        setSelectedChatData(contact);
        setSearchedContacts([]);
      }
      // Call API when the component mounts
      useEffect(() => {
        SearchContacts(''); // Call with empty search to load all 
        
      }, []);
  return (
    <>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                <FaPlus className='text-neutral-400 font-light text-opacity-90 text-start hover:text-neutral-100 cursor-pointer transition-all dur300'
                onClick={()=>setOpenNewContactModel(true)}
                />
            </TooltipTrigger>
            <TooltipContent className="bg-[#1c1b1e] border-none mb-2 p-3 text-white">
            <p>Select New Contact</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
    <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
       
        <DialogContent className="bg-[#181920] border-none text-white w-[400px] h-[400px] flex flex-col">
            <DialogHeader>
            <DialogTitle>Please Select A Contacts</DialogTitle>
            <DialogDescription>
               
            </DialogDescription>
            </DialogHeader>
            <div>
                <Input
                placeholder="Search Contacts"
                className="rounded-lg p-6 bg-[#2c2e2b] border-none"
                type="text"
                
                onChange={(e)=>SearchContacts(e.target.value)} />
            </div>
            <ScrollArea classNam="h-[250px]">
                <div className="flex flex-col gap-5">
                
                {loading ? (
        <p>Loading...</p>
      ) : (
        Array.isArray(SearchedContacts) && SearchedContacts.length > 0 ? (
          SearchedContacts.map((contact) => (
            <div key={contact._id} className='flex gap-3 items-center cursor-pointer' onClick={()=>selectNewContact(contact)}>
              <div className="w-12 h-12 relative">
                <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                  {contact.image ? (
                    <AvatarImage 
                      src={`http://localhost:8787/${contact.image}`} 
                      alt="Profile" 
                      className="object-cover w-full h-full bg-black" 
                    />
                  ) : (
                    <div className={`uppercase h-12 w-12  text-lg flex items-center justify-center ${getColor(contact.color)}`}>
                      {contact.firstName 
                        ? contact.firstName.charAt(0) 
                        : contact.Email.charAt(0)
                      }
                    </div>
                  )}
                </Avatar>
              </div>
              <div className="flex flex-col">
                <span>
                  {contact.firstName && contact.lastName 
                    ? `${contact.firstName} ${contact.lastName}` 
                    : " "
                  }
                </span>
                <span className='text-xs'>{contact.Email}</span>
              </div>
            </div>
          ))
        ) : (
          <p>No contacts available...</p>
        )
      )}

                    {/* {
                    Array.isArray(SearchContacts) && SearchContacts.length > 0 ? (
                        SearchContacts.map((contact) => (
                        <div key={contact._id} className='flex gap-3 items-center cursor-pointer'>
                            <div className="w-12 h-12 relative">
                            <Avatar className="h-12 w-12  rounded-full overflow-hidden">
                                {contact.image ? (
                                <AvatarImage 
                                    src={`http://localhost:8787/${contact.image}`} 
                                    alt="Profile" 
                                    className="object-cover w-full h-full bg-black" 
                                />
                                ) : (
                                <div className={`uppercase h-12 w-12  text-lg flex items-center justify-center ${getColor(contact.color)}`}>
                                    {contact.firstName 
                                    ? contact.firstName.charAt(0) 
                                    : contact.Email.charAt(0)
                                    }
                                </div>
                                )}
                            </Avatar>
                            </div>
                            <div className="flex flex-col">
                            <span>
                                {contact.firstName && contact.lastName 
                                ? `${contact.firstName} ${contact.lastName}` 
                                : " "
                                }
                            </span>
                            <span className='text-xs'>{contact.Email}</span>
                            </div>
                        </div>
                        ))
                    ) : (
                        <p>Loading or no contacts available...</p>
                    )
                    } */}

                </div>
            </ScrollArea>
            {
                SearchedContacts.length<=0 && (
                    <div className="flex-1 md:bg-[#181920] md:flex flex-col justify-center items-center  duration-300 transition-all">
                    <Lottie
                    isClickToPauseDisabled={true}
                    height={120}
                    width={120}
                    options={animationDefaultOptions}
                    />
              
                    <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-2xl text-xl transition-all duration-300 text-center">
                      <h3 className="poppins-medium">
                          Hi <span className="text-purple-500">!</span> Search New
                          <span className="text-purple-500"> Contacts</span>
                          <span className="text-purple-500">.</span>
                      </h3>
                    </div>
                  </div>
                )
            }
        </DialogContent>
    </Dialog>

    </>
  )
}

export default NewDm
