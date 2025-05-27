import { PostPreview } from "../Models/Post";
import { Card, CardContent, Typography, Box} from "@mui/material";
import { 
  Person as PersonIcon,
  CalendarToday as CalendarIcon
} from "@mui/icons-material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

type PostListProps = {
  posts: PostPreview[];
};

type UserDisplayNames = Record<string, string>;

const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return "";
  
  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())){
      return dateString;
    } 

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return dateString;
  }
};

export const PostList = ({ posts }: PostListProps) => {
  const [userDisplayNames, setUserDisplayNames] = useState<UserDisplayNames>({});
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUserDisplayNames = async () => {
      const uniqueAuthorIds = [...new Set(posts.map(post => post.author))];
      const namePromises = uniqueAuthorIds.map(async (authorId) => {
        try {
          const response = await fetch(`${API_BASE_URL}/Auth/${authorId}`, {
            credentials: "include",
          });
          if (response.ok) {
            const user = await response.json();
            return { id: authorId, displayName: user.displayName || user.username || authorId };
          }
        } catch (error) {
          console.error(`Error fetching user ${authorId}:`, error);
        }
        return { id: authorId, displayName: authorId };
      });

      const userNames = await Promise.all(namePromises);
      const namesMap: UserDisplayNames = {};
      userNames.forEach(({ id, displayName }) => {
        namesMap[id] = displayName;
      });
      setUserDisplayNames(namesMap);
    };

    if (posts.length > 0) {
      fetchUserDisplayNames();
    }
  }, [posts, API_BASE_URL]);

  const handlePostClick = (postId: number) => {
    navigate(`/post/${postId}`);
  };

  if (posts.length === 0) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="200px"
        color="text.secondary"
      >
        <Typography variant="h6">No posts found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 2 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
          },
          gap: 4,
        }}
      >
        {posts.map((post) => (
          <Card 
            key={post.id}
            sx={{ 
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4,
              },
              borderRadius: 2,
            }}
            onClick={() => handlePostClick(post.id)}
          >
            <CardContent sx={{ flexGrow: 1, minHeight: 200 }}>
              <Typography 
                variant="h6" 
                component="h2" 
                gutterBottom
                sx={{ 
                  fontWeight: 600,
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  mb: 2
                }}
              >
                {post.title}
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <PersonIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {userDisplayNames[post.author] || post.author}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <CalendarIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2" color="text.secondary">
                  {formatDateForDisplay(post.createdDate)}
                </Typography>
              </Box>

              <Typography 
                variant="body2" 
                color="text.secondary"
                sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 4,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.5,
                  wordWrap: 'break-word',
                  wordBreak: 'break-word',
                  fontSize: '0.875rem',
                }}
              >
                {post.contentPreview}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};