import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "light",
  user: null,
  token: null,
  posts: [],
  convoId : "",
  convos : [],
  messages : [],
  sent : false,
  activeChatFriend : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setSent : (state) => {
      state.sent = !state.sent
    },
    setConvoId : (state , action) => {
      state.convoId = action.payload.convoId
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
    },
    setFriends: (state, action) => {
      if (state.user) {
        state.user.friends = action.payload.friends;
      } else {
        console.error("user friends non-existent :(");
      }
    },
    setConvos : (state , action) => {
      if(state.user){
        state.convos = action.payload.convos
      }
      else{
        console.log("No conversations for this user")
      }
    },
    setMessages : (state , action) => {
      if (state.user) {
        state.messages = action.payload.messages
      } else {
        console.log("No messages")
      }
    },
    setPosts: (state, action) => {
      state.posts = action.payload.posts;
    },
    setPost: (state, action) => {
      const updatedPosts = state.posts.map((post) => {
        if (post._id === action.payload.post._id) return action.payload.post;
        return post;
      });
      state.posts = updatedPosts;
    },
    setActiveChatFriend : (state , action) => {
      state.activeChatFriend = {
        friendName : action.payload.friend.friendName,
        photo : action.payload.friend.photo
      }
    }
  },
});

export const { setMode, setSent, setConvoId, setLogin, setLogout, setFriends, setConvos, setMessages, setPosts, setPost, setActiveChatFriend } =
  authSlice.actions;
export default authSlice.reducer;
