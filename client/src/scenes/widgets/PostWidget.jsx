import {
  ChatBubbleOutlineOutlined,
  FavoriteBorderOutlined,
  FavoriteOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  InputBase,
} from "@mui/material";
import FlexBetween from "components/FlexBetween";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "state";
import { SendOutlined, SentimentSatisfiedOutlined } from "@mui/icons-material";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { useNavigate } from "react-router-dom";
import { blue } from "@mui/material/colors";

const PostWidget = ({
  postId,
  postUserId,
  name,
  description,
  location,
  picturePath,
  userPicturePath,
  likes,
  comments,
}) => {
  const [isComments, setIsComments] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.token);
  const loggedInUserId = useSelector((state) => state.user._id);
  const isLiked = Boolean(likes[loggedInUserId]);
  const likeCount = Object.keys(likes).length;
  const [text, setText] = useState("");
  const [isEmoji, setIsEmoji] = useState(false);

  const { palette } = useTheme();
  const main = palette.neutral.main;
  const primary = palette.primary.main;

  const patchLike = async () => {
    const response = await fetch(`http://localhost:8000/posts/${postId}/like`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId: loggedInUserId }),
    });
    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
  };

  const sendMessage = async () => {
    const user = await fetch(`http://localhost:8000/users/${loggedInUserId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = await user.json();

    const response = await fetch(
      `http://localhost:8000/posts/${postId}/comment`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId : loggedInUserId,
          username: userData.firstName + " " + userData.lastName,
          comment: text,
        }),
      }
    );

    const updatedPost = await response.json();
    dispatch(setPost({ post: updatedPost }));
    console.log(updatedPost);
    setIsEmoji(false);
    setText("");
    // console.log(text)
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent the default behavior of the Enter key (e.g., adding a new line)
      sendMessage();
    }
  };

  return (
    <WidgetWrapper m="2rem 0">
      <Friend
        friendId={postUserId}
        name={name}
        subtitle={location}
        userPicturePath={userPicturePath}
      />
      <Typography color={main} sx={{ mt: "1rem" }}>
        {description}
      </Typography>
      {picturePath && (
        <img
          width="100%"
          height="auto"
          alt="post"
          style={{ borderRadius: "0.75rem", marginTop: "0.75rem" }}
          src={`http://localhost:8000/assets/${picturePath}`}
        />
      )}
      <FlexBetween mt="0.25rem">
        <FlexBetween gap="1rem">
          <FlexBetween gap="0.3rem">
            <IconButton onClick={patchLike}>
              {isLiked ? (
                <FavoriteOutlined sx={{ color: primary }} />
              ) : (
                <FavoriteBorderOutlined />
              )}
            </IconButton>
            <Typography>{likeCount}</Typography>
          </FlexBetween>

          <FlexBetween gap="0.3rem">
            <IconButton onClick={() => setIsComments(!isComments)}>
              <ChatBubbleOutlineOutlined />
            </IconButton>
            <Typography>{comments.length}</Typography>
          </FlexBetween>
        </FlexBetween>

        <IconButton>
          <ShareOutlined />
        </IconButton>
      </FlexBetween>
      {isComments && (
        <Box mt="0.5rem">
          {comments.map((comment, i) => (
            <Box key={`${name}-${i}`}>
              <Divider />
              {comment.username && <Typography
                sx={{
                  m: "0.5rem 0",
                  pl: "1rem",
                  "&:hover": {
                    cursor: "pointer",
                  },
                }}
                onClick={() => {
                  navigate(`/profile/${comment.userId}`);
                }}
                display = "inline"
                fontWeight="bold"
              >
                {/* <strong>

                </strong> */}
                {comment.username}
              </Typography>}
              <Typography
                sx={{
                  color: main,
                  m: "0.5rem 0",
                  pl: "1rem",
                }}
                display = "inline"
              >
                {comment.comment}
              </Typography>
            </Box>
          ))}
          <Divider />
          {isEmoji && (
            <Box style={{ zIndex: "99" }}>
              <Picker
                data={data}
                onEmojiSelect={(e) => {
                  console.log(e.native);

                  setText(text + e.native);
                }}
              />
            </Box>
          )}
          <FlexBetween gap="1.5rem">
            <IconButton
              onClick={() => {
                setIsEmoji(!isEmoji);
                // console.log(isEmoji)
              }}
            >
              <SentimentSatisfiedOutlined />
            </IconButton>

            <InputBase
              placeholder="Add a comment..."
              onChange={(e) => setText(e.target.value)}
              onClick={() => setIsEmoji(false)}
              value={text}
              sx={{
                height: "60%",
                width: "80%",
                backgroundColor: palette.neutral.light,
                borderRadius: "2rem",
                padding: "0.5rem 2rem",
                margin: "1rem 0rem",
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
        </Box>
      )}
    </WidgetWrapper>
  );
};

export default PostWidget;
