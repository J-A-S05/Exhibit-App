import {
  Divider,
  Typography,
  Box,
  InputBase,
  useTheme,
  IconButton,
} from "@mui/material";
import WidgetWrapper from "components/WidgetWrapper";
import React, { useRef, useState, useEffect } from "react";
import FlexBetween from "components/FlexBetween";
import { setActiveChatFriend, setMessages } from "state";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { SendOutlined, SentimentSatisfiedOutlined } from "@mui/icons-material";
import SingleMessage from "components/SingleMessage";
import { setConvoId } from "state";
import Friend from "components/Friend";
// import { setml } from 'state'
import { io } from "socket.io-client";
import { setSent } from "state";
// import EmojiPicker from 'emoji-picker-react'
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import UserImage from "components/UserImage";

const MessageWidget = ({ messages, socket }) => {
  // const socket = useRef()
  const scrollRef = useRef();
  const navigate = useNavigate();
  const sent = useSelector((state) => state.sent);
  const chatBoxRef = useRef(null);
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const [text, setText] = useState("");
  const token = useSelector((state) => state.token);
  const dispatch = useDispatch();
  const convoId = useSelector((state) => state.convoId);
  const { _id } = useSelector((state) => state.user);
  const [isEmoji, setIsEmoji] = useState(false);
  const [currentEmoji, setCurrentEmoji] = useState(null);
  const friend = useSelector((state) => state.activeChatFriend);
  // const ml = useSelector((state) => state.ml)

  // useEffect(() => {
  //   socket.current = io("ws://localhost:8900")

  // } , [])
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    setIsEmoji(false);
    const newMessage = {
      conversationId: convoId,
      sender: _id,
      text: text,
    };
    const response = await fetch(`http://localhost:8000/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    });
    const texts = await response.json();
    dispatch(setMessages({ messages: texts }));
    setText("");

    const convo = await fetch(
      `http://localhost:8000/conversations/byconvo/${convoId}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const convoData = await convo.json();
    const friendId = convoData.members.find((member) => member !== _id);

    // console.log("friend" + friendId)
    socket.current.emit("sendMessage", {
      senderId: _id,
      receiverId: friendId,
      text: text,
    });

    dispatch(setSent({ sent: !sent }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of the Enter key (e.g., adding a new line)
      sendMessage();
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setCurrentEmoji(emojiObject);
    console.log(emojiObject.target);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
    // setScrollbarStyles()
  }, [messages.length]);

  return (
    <div>
      <WidgetWrapper>
        {/* all messages  */}
        {/* <FlexBetween> */}

        <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={friend.photo} size="40px" />
        <Box>
          <Typography
            color={main}
            variant="h4"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {friend.friendName}
          </Typography>
        </Box>
      </FlexBetween>
    </FlexBetween>
        <div
          className="chat-box"
          style={{ gap: "1.5rem", maxHeight: "500px", overflow: "auto" }}
          ref={scrollRef}
        >
          
          {messages.map((m) => (
            <Box
              display="flex"
              flexDirection="column"
              alignItems={m.sender === _id ? "flex-end" : "flex-start"}
            >
              <Typography
                variant="body1"
                gap="1.5rem"
                backgroundColor={`${palette.neutral.light}`}
                borderRadius={
                  m.sender === _id ? "2rem 0 2rem 2rem" : "0 2rem 2rem 2rem"
                }
                padding="1rem 2rem"
              >
                {m.text}
              </Typography>
            </Box>
          ))}
        </div>

        {isEmoji && (
          <Box style={{ zIndex: "99" }}>
            <Picker
              data={data}
              onEmojiSelect={(e) => {
                console.log(e.native);
                setCurrentEmoji(e.native);
                setText(text + e.native);
              }}
            />
          </Box>
        )}
        <Divider sx={{ margin: "1.25rem 0" }} />

        {/* INPUT AREA */}

        <FlexBetween gap="1.5rem">
          <IconButton
            onClick={() => {
              setIsEmoji(true);
              // console.log(isEmoji)
            }}
          >
            <SentimentSatisfiedOutlined />
          </IconButton>

          <InputBase
            placeholder="What's on your mind..."
            onChange={(e) => setText(e.target.value)}
            onClick={() => setIsEmoji(false)}
            value={text}
            sx={{
              width: "100%",
              backgroundColor: palette.neutral.light,
              borderRadius: "2rem",
              padding: "1rem 2rem",
            }}
            onKeyDown={handleKeyPress}
          />

          <IconButton
            disabled={!text.length}
            onClick={sendMessage}
            // sx={{
            //   color: palette.background.alt,
            //   backgroundColor: palette.primary.main,
            //   borderRadius: "3rem",
            // }}
          >
            <SendOutlined />
          </IconButton>
        </FlexBetween>
      </WidgetWrapper>
    </div>
  );
};

export default MessageWidget;
