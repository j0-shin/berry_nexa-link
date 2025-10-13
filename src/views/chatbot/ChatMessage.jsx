import React from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
  Box,
  Typography,
  Avatar,
  Paper,
  Chip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// icons
import { IconUser, IconRobot } from '@tabler/icons-react';

// ==============================|| CHAT MESSAGE COMPONENT ||============================== //

const ChatMessage = ({ message, isUser, timestamp, isTyping = false }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        mb: 2,
        gap: 1
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? theme.palette.primary.main : theme.palette.secondary.main,
          width: 32,
          height: 32
        }}
      >
        {isUser ? <IconUser size={18} /> : <IconRobot size={18} />}
      </Avatar>
      
      <Box sx={{ maxWidth: '70%', minWidth: '200px' }}>
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: isUser 
              ? theme.palette.primary.light 
              : theme.palette.background.paper,
            color: isUser 
              ? theme.palette.primary.contrastText 
              : theme.palette.text.primary,
            borderRadius: isUser 
              ? '16px 16px 4px 16px' 
              : '16px 16px 16px 4px'
          }}
        >
          {isTyping ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2">AI is typing</Typography>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[0, 1, 2].map((i) => (
                  <Box
                    key={i}
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: 'text.secondary',
                      animation: 'pulse 1.5s ease-in-out infinite',
                      animationDelay: `${i * 0.2}s`,
                      '@keyframes pulse': {
                        '0%, 80%, 100%': {
                          opacity: 0.3
                        },
                        '40%': {
                          opacity: 1
                        }
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>
          ) : (
            <Typography 
              variant="body2" 
              sx={{ 
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {message}
            </Typography>
          )}
        </Paper>
        
        {timestamp && !isTyping && (
          <Typography 
            variant="caption" 
            color="text.secondary"
            sx={{ 
              display: 'block', 
              mt: 0.5,
              textAlign: isUser ? 'right' : 'left'
            }}
          >
            {new Date(timestamp).toLocaleTimeString()}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

ChatMessage.propTypes = {
  message: PropTypes.string.isRequired,
  isUser: PropTypes.bool.isRequired,
  timestamp: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  isTyping: PropTypes.bool
};

export default ChatMessage;
