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
import openaiService from '../../services/openaiService';
import { availableFunctions, functionHandlers } from '../../services/agentFunctions';

// ==============================|| CHATBOT PAGE ||============================== //

const Chatbot = () => {
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
  const [settingsOpen, setSettingsOpen] = useState(false);
  
  // 설정 상태
  const [settings, setSettings] = useState({
    apiKey: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
    agentMode: false
  });

  // 메시지 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 메시지 전송 핸들러
  const handleSendMessage = async (messageText) => {
    if (!settings.apiKey) {
      setError('OpenAI API 키를 설정해주세요.');
      setShowError(true);
      setSettingsOpen(true);
      return;
    }

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
      // OpenAI API 호출을 위한 메시지 형식 변환
      const apiMessages = messages
        .filter(msg => !msg.isTyping)
        .map(msg => ({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.message
        }));
      
      // 현재 사용자 메시지 추가
      apiMessages.push({
        role: 'user',
        content: messageText
      });

      let response;
      
      // AI Agent 모드인 경우 함수 호출 기능 사용
      if (settings.agentMode) {
        // tools 형식으로 변환
        const tools = availableFunctions.map(func => ({
          type: "function",
          function: func
        }));

        response = await openaiService.sendMessageWithTools(apiMessages, tools, {
          model: settings.model,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens
        });
      } else {
        // 일반 채팅 모드
        response = await openaiService.sendMessage(apiMessages, {
          model: settings.model,
          temperature: settings.temperature,
          maxTokens: settings.maxTokens
        });
      }

      if (response.success) {
        const responseMessage = response.message;
        
        // 함수 호출이 있는 경우 처리
        if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
          // 함수 호출 메시지 추가
          const functionCallMessage = {
            id: Date.now() + 1,
            message: "함수를 실행하고 있습니다...",
            isUser: false,
            timestamp: Date.now(),
            isFunction: true
          };
          setMessages(prev => [...prev, functionCallMessage]);

          // 함수 실행 결과를 위한 메시지 배열 업데이트
          const updatedMessages = [...apiMessages, responseMessage];

          // 각 함수 호출 처리
          for (const toolCall of responseMessage.tool_calls) {
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);
            
            // 함수 실행
            const functionResult = await functionHandlers[functionName](functionArgs);
            
            // 함수 결과를 메시지에 추가
            updatedMessages.push({
              role: "tool",
              tool_call_id: toolCall.id,
              content: JSON.stringify(functionResult)
            });
          }

          // 함수 실행 결과를 포함하여 다시 API 호출
          const finalResponse = await openaiService.sendMessage(updatedMessages, {
            model: settings.model,
            temperature: settings.temperature,
            maxTokens: settings.maxTokens
          });

          if (finalResponse.success) {
            // 최종 AI 응답 메시지 추가
            const aiMessage = {
              id: Date.now() + 2,
              message: finalResponse.message,
              isUser: false,
              timestamp: Date.now()
            };
            setMessages(prev => prev.filter(msg => !msg.isFunction).concat([aiMessage]));
          } else {
            throw new Error(finalResponse.error);
          }
        } else {
          // 일반 응답 메시지 추가
          const aiMessage = {
            id: Date.now() + 1,
            message: responseMessage.content || responseMessage,
            isUser: false,
            timestamp: Date.now()
          };
          setMessages(prev => [...prev, aiMessage]);
        }
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setError(`오류가 발생했습니다: ${error.message}`);
      setShowError(true);
      
      // 오류 메시지 추가
      const errorMessage = {
        id: Date.now() + 1,
        message: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
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
      title="AI Chatbot"
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
          <Button
            variant="outlined"
            size="small"
            startIcon={<IconSettings />}
            onClick={() => setSettingsOpen(true)}
          >
            설정
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

      {/* 설정 다이얼로그 */}
      <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Chatbot 설정</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="OpenAI API Key"
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings(prev => ({ ...prev, apiKey: e.target.value }))}
              helperText="OpenAI API 키를 입력하세요"
            />
            
            <TextField
              fullWidth
              label="모델"
              select
              SelectProps={{ native: true }}
              value={settings.model}
              onChange={(e) => setSettings(prev => ({ ...prev, model: e.target.value }))}
            >
              <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-4-turbo-preview">GPT-4 Turbo</option>
            </TextField>

            <TextField
              fullWidth
              label="Temperature"
              type="number"
              inputProps={{ min: 0, max: 2, step: 0.1 }}
              value={settings.temperature}
              onChange={(e) => setSettings(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
              helperText="0-2 사이의 값 (창의성 조절)"
            />

            <TextField
              fullWidth
              label="Max Tokens"
              type="number"
              inputProps={{ min: 1, max: 4000 }}
              value={settings.maxTokens}
              onChange={(e) => setSettings(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
              helperText="응답 최대 길이"
            />

            <FormControlLabel
              control={
                <Switch
                  checked={settings.agentMode}
                  onChange={(e) => setSettings(prev => ({ ...prev, agentMode: e.target.checked }))}
                />
              }
              label="AI Agent 모드 (함수 호출 기능)"
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSettingsOpen(false)}>취소</Button>
          <Button onClick={handleSaveSettings} variant="contained">저장</Button>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default Chatbot;
