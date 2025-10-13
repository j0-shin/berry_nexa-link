import React, { useState } from 'react';
import PropTypes from 'prop-types';

// material-ui
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Chip,
  Stack
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// icons
import { IconSend, IconMicrophone, IconPaperclip } from '@tabler/icons-react';

// ==============================|| CHAT INPUT COMPONENT ||============================== //

const ChatInput = ({ onSendMessage, disabled = false, placeholder = "메시지를 입력하세요..." }) => {
  const theme = useTheme();
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // 빠른 응답 템플릿
  const quickResponses = [
    "안녕하세요!",
    "도움이 필요해요",
    "설명해주세요",
    "감사합니다"
  ];

  const handleQuickResponse = (response) => {
    if (!disabled) {
      onSendMessage(response);
    }
  };

  return (
    <Box sx={{ p: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
      {/* 빠른 응답 버튼들 */}
      <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1 }}>
        {quickResponses.map((response, index) => (
          <Chip
            key={index}
            label={response}
            variant="outlined"
            size="small"
            onClick={() => handleQuickResponse(response)}
            disabled={disabled}
            sx={{
              cursor: disabled ? 'default' : 'pointer',
              '&:hover': {
                bgcolor: disabled ? 'transparent' : theme.palette.action.hover
              }
            }}
          />
        ))}
      </Stack>

      {/* 메시지 입력 영역 */}
      <Paper
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 1,
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          bgcolor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2
        }}
      >
        <IconButton
          size="small"
          disabled={disabled}
          sx={{ color: theme.palette.text.secondary }}
        >
          <IconPaperclip size={20} />
        </IconButton>

        <TextField
          fullWidth
          multiline
          maxRows={4}
          variant="standard"
          placeholder={placeholder}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={disabled}
          InputProps={{
            disableUnderline: true,
            sx: {
              fontSize: '0.875rem',
              '& .MuiInputBase-input': {
                py: 1
              }
            }
          }}
        />

        <IconButton
          size="small"
          disabled={disabled}
          sx={{ color: theme.palette.text.secondary }}
        >
          <IconMicrophone size={20} />
        </IconButton>

        <IconButton
          type="submit"
          size="small"
          disabled={disabled || !message.trim()}
          sx={{
            color: message.trim() && !disabled 
              ? theme.palette.primary.main 
              : theme.palette.text.disabled,
            '&:hover': {
              bgcolor: theme.palette.primary.light + '20'
            }
          }}
        >
          <IconSend size={20} />
        </IconButton>
      </Paper>
    </Box>
  );
};

ChatInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string
};

export default ChatInput;
