import WidgetWrapper from 'components/WidgetWrapper'
import React, { useState } from 'react'
import { Box, Typography, useTheme } from "@mui/material";
// import Friend from "components/Friend";
import ConvosWidget from './ConvosWidget';
// import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends , setConvos } from "state";

const AllConvosWidget = ({userId}) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user)
  const { palette } = useTheme();
  const token = useSelector((state) => state.token);
  const friends = useSelector((state) => state.user.friends);
  // const [convos , setConvos] = useState([]);
  // const [friendList , setFriendList] = useState([]);
  // const friendConvoIdMap = new Map();
  const convos = useSelector((state) => state.convos);

  const getFriends = async () => {
    // console.log(user)
    const response = await fetch(
      `http://localhost:8000/users/${userId}/friends`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setFriends({ friends: data }));
  };

  const getConvos = async () => {
    const response = await fetch(`http://localhost:8000/conversations/${userId}` , {
        method : "GET",
        headers : { Authorization : `Bearer ${token}` }
    });

    const data = await response.json();
    dispatch(setConvos({convos : data}))

    // convos.map((c) => friendConvoIdMap.set(c.members[1] , c._id))

    // console.log(friendConvoIdMap);

  }

    useEffect(() => {
      getFriends();
      getConvos();
      // console.log(friendList)
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
        <WidgetWrapper>
            {user && (

                <>
                
      <Typography
        color={palette.neutral.dark}
        variant="h5"
        fontWeight="500"
        sx={{ mb: "1.5rem" }}
      >
        Chats
      </Typography>

      <Box display="flex" flexDirection="column" gap="1.5rem">
        
        {friends.map((friend) => (
          <ConvosWidget
            key={friend._id}
            friendId={friend._id}
            name={`${friend.firstName} ${friend.lastName}`}
            subtitle={friend.occupation}
            userPicturePath={friend.picturePath}
          />
        ))}
      </Box>
                </>
            )}
    </WidgetWrapper>
    </div>
  )
}

export default AllConvosWidget



