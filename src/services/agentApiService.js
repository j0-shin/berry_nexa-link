import axios from 'axios';

// CORS 이슈 발생하여 proxy 처리, API_ENDPOINT 변경
//const API_ENDPOINT = 'https://genai-openapi.sec.samsung.net/dxhq/trial/api-agent';
const API_ENDPOINT = '/j0.shin/api-agent';
const API_PATH = '/openapi/agent-chat/v1/agent-messages';

const agentApiService = {
  sendMessage: async (messageContent, agentId = "0199f507-5aed-7c17-adf2-bffb9aa47937") => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'x-generative-ai-client': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjbGllbnRJZCI6ImZmMzdlZGY0LTE0ODAtNDljZC04YTgwLTY2YWJlZmU5ZGJkYi0xMDkzIiwiY2xpZW50U2VjcmV0IjoiaDM2ejBZU1JkUXYzYlpXTE1QVWJkdEFJWDZuRzZnWGMiLCJleHAiOjE3NjE2NjM1OTl9.k694-RpEcOLUbhKM5cHwWCEu-D2S3kZe37jiSdp40G0',
        'x-openapi-token': 'Bearer eyJ4NXQiOiJNV0l5TkRJNVlqRTJaV1kxT0RNd01XSTNOR1ptTVRZeU5UTTJOVFZoWlRnMU5UTTNaVE5oTldKbVpERTFPVEE0TldFMVlUaGxNak5sTldFellqSXlZUSIsImtpZCI6Ik1XSXlOREk1WWpFMlpXWTFPRE13TVdJM05HWm1NVFl5TlRNMk5UVmhaVGcxTlRNM1pUTmhOV0ptWkRFMU9UQTROV0UxWVRobE1qTmxOV0V6WWpJeVlRX1JTMjU2IiwidHlwIjoiYXQrand0IiwiYWxnIjoiUlMyNTYifQ.eyJzdWIiOiJmMTJkMWRiYS1lOWM0LTQ3MzktOGRmNy03Y2IxZjM1MTIxZGEiLCJhdXQiOiJBUFBMSUNBVElPTiIsImF1ZCI6Im8xUGIwTHNaY3FvdVR3RmI2d1dZdHBhR2pnY2EiLCJuYmYiOjE3NTkxMjgwMDYsImF6cCI6Im8xUGIwTHNaY3FvdVR3RmI2d1dZdHBhR2pnY2EiLCJzY29wZSI6ImRlZmF1bHQiLCJpc3MiOiJodHRwczpcL1wvaW5ub3ZhdGlvbi13c28yLnNlYy5zYW1zdW5nLm5ldDo0NDNcL29hdXRoMlwvdG9rZW4iLCJleHAiOjQ5MTQ4ODgwMDYsImlhdCI6MTc1OTEyODAwNiwianRpIjoiOTVkZmIyMjctMzk4Ni00NDBkLTkxNjMtMDk5NDc5NjFkOGIwIiwiY2xpZW50X2lkIjoibzFQYjBMc1pjcW91VHdGYjZ3V1l0cGFHamdjYSJ9.FAfJi9wlko3WcAki8-79OVnzv796fHh5ITn8qs066NAdeLKZ9KPJjnur1SKz-ZG7scsZ49193eAqe5YvBAKvr1rISwnhCh9FyD3YauP61LZg2vI9_VUea-_q4BiAOI-t7YIJxMjWY5vAMgVZfTrvaS0e9rAYXPIpDT2UtqwAsQqftn1pUWR1EtJhGw2f6YSMlUd4Ox_VFBKqlrtLvtMj3uO1yl5uFxdJR8bbdZUNvj24YI0K_FtAd5zp6ZZQaQTB5394G5lbKxTLHVR84gWD5oWKw1JsYYnvNDm30Zv1GcD-23q8D6s1oIvaKhGp0febQEHf4LmG7iYIRiQp-kLetQ',
        // 'x-generative-ai-user-email': 'test@test.com' // Optional
      };

      const requestBody = {
        agentId: agentId,
        contents: [messageContent],
        isStream: false,
        isRagOn: true,
        executeFinalAnswer: true,
        executeRagFinalAnswer: true,
        executeRagStandaloneQuery: true
      };

      // 디버그용 코드 (API 호출 잘 되는지 확인 목적)
      console.log("Agent API Request URL:", `${API_ENDPOINT}${API_PATH}`);
      console.log("Agent API Request Headers:", headers);
      console.log("Agent API Request Body:", requestBody);
      //---

      const response = await axios.post(`${API_ENDPOINT}${API_PATH}`, requestBody, { headers });
      
      // 디버그용 코드 (API 호출 잘 되는지 확인 목적)
      console.log("Agent API Response Data:", response.data);
      //---

      // API 응답 구조에 따라 메시지 추출 로직 변경 필요
      // 현재는 응답 전체를 반환하도록 가정
      return { success: true, message: response.data };
    } catch (error) {
      console.error('Agent API error:', error);
      // 디버그용 코드 (API 호출 잘 되는지 확인 목적)
      console.error("Agent API Error Response Data:", error.response?.data);
      //---
      return { success: false, error: error.response?.data?.message || error.message };
    }
  }
};

export default agentApiService;
