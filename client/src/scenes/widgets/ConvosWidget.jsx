import { PersonAddOutlined, PersonRemoveOutlined } from "@mui/icons-material";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { setFriends } from "state";
import { setConvoId } from "state";
import FlexBetween from "components/FlexBetween";
import UserImage from "components/UserImage";
import { useEffect } from "react";
import { setActiveChatFriend } from "state";


const ConvosWidget = ({ friendId, name, subtitle, userPicturePath }) => {
  const dispatch = useDispatch();

  const { _id } = useSelector((state) => state.user);
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  const convoId = useSelector((state) => state.convoId);

  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const activefriend = useSelector((state) => state.activeChatFriend)
  

  const isFriend = friends.find((friend) => friend._id === friendId);

  const createConvo = async () => {
    const newConvo = {
      senderId : _id,
      receiverId : friendId
    }
    // const members = [_id , friendId]
    const res = await fetch(`http://localhost:8000/conversations` , {

        method: "POST",
        headers : {"Content-Type" : "application/json"},
        body: JSON.stringify(newConvo)
      
    })

    const data = await res.json();
    dispatch(setConvoId({convoId : data[data.length - 1]._id}))
    // console.log(data[data.length-1]);
  }
  
  const handleChatClick = async () => {
    
    const response = await fetch(`http://localhost:8000/conversations/find/${_id}/${friendId}` , {
      method : "GET",
      headers : {Authorization : `Bearer ${token}`}
    })

    const d = await response.json()
    // console.log(d);
    if(d !== null){
      // const data = await response.json();
      dispatch(setConvoId({convoId : d._id}))

    }
    else{
      createConvo();

    }

    const f = await fetch(`http://localhost:8000/users/${friendId}` , {
      method : "GET",
      headers : {Authorization : `Bearer ${token}`}
    })

    const fData = await f.json();
    const friend = {friendName : `${fData.firstName }` + " " + `${fData.lastName}` , photo : fData.picturePath,}

    dispatch(setActiveChatFriend({friend}))
    
    console.log(activefriend)
  }

  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={userPicturePath} size="55px" />
        <Box
          onClick={() => {
            // navigate(`/profile/${friendId}`);
            // navigate(0);
            handleChatClick();
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton
        // onClick={() => patchFriend()}
        sx={{ backgroundColor: primaryLight, p: "0.6rem" }}
      >
        {isFriend ? (
          <PersonRemoveOutlined sx={{ color: primaryDark }} />
        ) : (
          <PersonAddOutlined sx={{ color: primaryDark }} />
        )}
      </IconButton>
    </FlexBetween>
  );
};

export default ConvosWidget;

