import React, { useState, useEffect, useRef } from 'react';

// material-ui
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Switch,
  FormControlLabel
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

// icons
import { IconSettings, IconTrash, IconDownload } from '@tabler/icons-react';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import agentApiService from '../../services/agentApiService';
// ==============================|| AGENT PAGE ||============================== //

const Agent = () => {
  const theme = useTheme();
  const messagesEndRef = useRef(null);
  
  // 상태 관리
  const [messages, setMessages] = useState([
    {
      id: 1,
      message: "안녕하세요! 저는 AI 어시스턴트입니다. 무엇을 도와드릴까요?",
      isUser: false,
      timestamp: Date.now()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);


  // 메시지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSendMessage = async (messageText) => {
    // 사용자 메시지 추가
    const userMessage = {
      id: Date.now(),
      message: messageText,
      isUser: true,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await agentApiService.sendMessage(messageText);

      if (response.success) {
        // API 응답에서 실제 메시지 내용을 추출 (API 응답 구조에 따라 조정 필요)
        //const agentResponse = response.message.result.finalAnswer;
        // API Response 예시 case를 전달하여 반영함.
        const agentResponse = response.message.content;
        const aiMessage = {
          id: Date.now() + 1,
          message: agentResponse,
          isUser: false,
          timestamp: Date.now()
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Agent API error:', error);
      setError(`오류가 발생했습니다: ${error.message}`);
      setShowError(true);
      
      const errorMessage = {
        id: Date.now() + 1,
        message: "죄송합니다. Agent API 호출 중 오류가 발생했습니다. 다시 시도해주세요.",
        isUser: false,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // 채팅 초기화
  const handleClearChat = () => {
    setMessages([
      {
        id: 1,
        message: "안녕하세요! 저는 AI 어시스턴트입니다. 무엇을 도와드릴까요?",
        isUser: false,
        timestamp: Date.now()
      }
    ]);
  };

  // 채팅 내보내기
  const handleExportChat = () => {
    const chatText = messages
      .map(msg => `${msg.isUser ? 'User' : 'AI'} (${new Date(msg.timestamp).toLocaleString()}): ${msg.message}`)
      .join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // 설정 저장
  const handleSaveSettings = () => {
    // API 키를 환경변수에 임시 저장 (실제 환경에서는 보안 고려 필요)
    import.meta.env.VITE_APP_OPENAI_API_KEY = settings.apiKey;
    setSettingsOpen(false);
  };

  return (
    <MainCard
      title="AI Agent"
      secondary={
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<IconDownload />}
            onClick={handleExportChat}
            disabled={messages.length <= 1}
          >
            내보내기
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<IconTrash />}
            onClick={handleClearChat}
            disabled={messages.length <= 1}
          >
            초기화
          </Button>

        </Stack>
      }
      sx={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}
    >
      {/* 채팅 메시지 영역 */}
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: theme.palette.background.default,
          borderRadius: 1,
          mb: 2
        }}
      >
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg.message}
            isUser={msg.isUser}
            timestamp={msg.timestamp}
          />
        ))}
        
        {/* 로딩 표시 */}
        {isLoading && (
          <ChatMessage
            message=""
            isUser={false}
            isTyping={true}
          />
        )}
        
        <div ref={messagesEndRef} />
      </Box>

      {/* 채팅 입력 영역 */}
      <ChatInput
        onSendMessage={handleSendMessage}
        disabled={isLoading}
        placeholder={isLoading ? "AI가 응답 중입니다..." : "메시지를 입력하세요..."}
      />

      {/* 오류 스낵바 */}
      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert onClose={() => setShowError(false)} severity="error">
          {error}
        </Alert>
      </Snackbar>


    </MainCard>
  );
};

export default Agent;
