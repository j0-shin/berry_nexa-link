import axios from 'axios';

// OpenAI API 설정
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

class OpenAIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_APP_OPENAI_API_KEY || '';
    this.client = axios.create({
      baseURL: 'https://api.openai.com/v1',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // 채팅 메시지 전송
  async sendMessage(messages, options = {}) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: options.model || 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        stream: false
      });

      return {
        success: true,
        data: response.data,
        message: response.data.choices[0]?.message?.content || 'No response'
      };
    } catch (error) {
      console.error('OpenAI API Error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Unknown error occurred'
      };
    }
  }

  // 스트리밍 채팅 (향후 구현 가능)
  async sendStreamMessage(messages, onChunk, options = {}) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: options.model || 'gpt-3.5-turbo',
        messages: messages,
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7,
        stream: true
      }, {
        responseType: 'stream'
      });

      return response;
    } catch (error) {
      console.error('OpenAI Streaming Error:', error);
      throw error;
    }
  }

  // AI Agent 기능을 위한 함수 호출 (새로운 tools 형식 사용)
  async sendMessageWithTools(messages, tools, options = {}) {
    try {
      const response = await this.client.post('/chat/completions', {
        model: options.model || 'gpt-3.5-turbo',
        messages: messages,
        tools: tools,
        tool_choice: options.toolChoice || 'auto',
        max_tokens: options.maxTokens || 1000,
        temperature: options.temperature || 0.7
      });

      return {
        success: true,
        data: response.data,
        message: response.data.choices[0]?.message
      };
    } catch (error) {
      console.error('OpenAI Tools Error:', error);
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message || 'Unknown error occurred'
      };
    }
  }

  // 레거시 함수 호출 지원 (이전 버전 호환성)
  async sendMessageWithFunctions(messages, functions, options = {}) {
    // functions를 tools 형식으로 변환
    const tools = functions.map(func => ({
      type: "function",
      function: func
    }));

    return this.sendMessageWithTools(messages, tools, options);
  }

  // API 키 유효성 검사
  async validateApiKey() {
    try {
      const response = await this.client.get('/models');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || 'Invalid API key'
      };
    }
  }
}

export default new OpenAIService();
