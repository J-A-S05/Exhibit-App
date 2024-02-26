import React, { useEffect, useRef, useState } from 'react'
import Navbar from 'scenes/navbar'
import { Box, Typography, useMediaQuery } from "@mui/material";
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import MessageWidget from 'scenes/widgets/MessageWidget';
import AllConvosWidget from 'scenes/widgets/AllConvosWidget';
import { setConvoId , setMessages} from 'state';
import {io} from 'socket.io-client'

const ChatPage = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const ml = useSelector((state) => state.ml);
  const user = useSelector((state) => state.user)
  let _id = "";
  let picturePath = "";
  if(user){
    _id = user._id
    picturePath = user.picturePath
  }
  // const convoId = useSelector((state) => state.convoId);
  const token = useSelector((state) => state.token)
  const convoId = useSelector((state) => state.convoId);
  const messages = useSelector((state) => state.messages);
  const [allMessages , setAllMessages] = useState([]);
  const dispatch = useDispatch();
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const sent = useSelector((state) => state.sent);
  
  const socket = useRef()
  useEffect(() => {
  socket.current = io("ws://localhost:8900")
  socket.current.on("getMessage", (data) => {
    setArrivalMessage({
      conversationId : convoId,
      sender: data.senderId,
      text: data.text,
    });
  });
} , [])

// useEffect(() => {
//   console.log(arrivalMessage)
//   arrivalMessage && setAllMessages([...allMessages , arrivalMessage]);
//   // console.log(allMessages);
// }, [arrivalMessage]);


  useEffect(() => {
    socket.current.emit("addUser" , _id)
    socket.current.on("getUsers" , users => {
      // console.log(users)
    })
  } , [_id])

  useEffect(() => {
    const getMessages = async () => {
      const response = await fetch(`http://localhost:8000/messages/${convoId}` , {
        method : "GET",
        headers : {Authorization : `Bearer ${token}`}
      });

      const data = await response.json();
      setMessages({messages : data});
      setAllMessages(data)
    }

    getMessages();
    // console.log(messages)
    console.log(allMessages)

  } , [convoId , sent , arrivalMessage])

  return (
    <div>
      <Box>
      <Navbar />
      <Box
        width="100%"
        padding="2rem 6%"
        display={isNonMobileScreens ? "flex" : "block"}
        gap="0.5rem"
        justifyContent="space-between"
      >


        {/* ALL CONVOS */}
        <Box flexBasis={isNonMobileScreens ? "26%" : undefined} height= "100px">
          <AllConvosWidget userId = {_id}/>
        </Box>

        {/* PARTICULAR CONVO */}
        <Box
          flexBasis={isNonMobileScreens ? "60%" : undefined}
          mt={isNonMobileScreens ? undefined : "2rem"}
          height= "100px" 
        >
        {messages.length !== 0 && (
          <MessageWidget messages = {allMessages} socket = {socket} />
        )}
        </Box>

        
        {/* {isNonMobileScreens && ( */}
          {/* <Box flexBasis="26%"> */}
            {/* <AdvertWidget /> */}
            {/* <Box m="2rem 0" /> */}
            {/* <FriendListWidget userId={_id} /> */}
          {/* </Box> */}
        {/* )} */}

      </Box>
    </Box>


    </div>
  )
}

export default ChatPage
