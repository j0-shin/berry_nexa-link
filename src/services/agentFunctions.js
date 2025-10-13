// AI Agent가 사용할 수 있는 함수들 정의

// 날씨 정보 조회 함수
export const getWeatherInfo = {
  name: "get_weather_info",
  description: "특정 도시의 현재 날씨 정보를 조회합니다",
  parameters: {
    type: "object",
    properties: {
      city: {
        type: "string",
        description: "날씨를 조회할 도시명 (예: Seoul, Tokyo, New York)"
      },
      unit: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
        description: "온도 단위"
      }
    },
    required: ["city"]
  }
};

// 계산기 함수
export const calculator = {
  name: "calculator",
  description: "수학 계산을 수행합니다",
  parameters: {
    type: "object",
    properties: {
      expression: {
        type: "string",
        description: "계산할 수식 (예: 2+2, 10*5, sqrt(16))"
      }
    },
    required: ["expression"]
  }
};

// 현재 시간 조회 함수
export const getCurrentTime = {
  name: "get_current_time",
  description: "현재 시간을 조회합니다",
  parameters: {
    type: "object",
    properties: {
      timezone: {
        type: "string",
        description: "시간대 (예: Asia/Seoul, America/New_York)"
      },
      format: {
        type: "string",
        enum: ["12h", "24h"],
        description: "시간 형식"
      }
    },
    required: []
  }
};

// 메모 저장 함수
export const saveNote = {
  name: "save_note",
  description: "사용자의 메모를 저장합니다",
  parameters: {
    type: "object",
    properties: {
      title: {
        type: "string",
        description: "메모 제목"
      },
      content: {
        type: "string",
        description: "메모 내용"
      },
      tags: {
        type: "array",
        items: {
          type: "string"
        },
        description: "메모 태그들"
      }
    },
    required: ["title", "content"]
  }
};

// 웹 검색 함수
export const webSearch = {
  name: "web_search",
  description: "웹에서 정보를 검색합니다",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "검색할 키워드"
      },
      limit: {
        type: "number",
        description: "검색 결과 개수 (기본값: 5)"
      }
    },
    required: ["query"]
  }
};

// 함수 실행 핸들러들
export const functionHandlers = {
  get_weather_info: async (args) => {
    // 실제 환경에서는 날씨 API를 호출
    const { city, unit = "celsius" } = args;
    
    // 모의 날씨 데이터
    const mockWeatherData = {
      Seoul: { temp: 15, condition: "맑음", humidity: 60 },
      Tokyo: { temp: 18, condition: "흐림", humidity: 70 },
      "New York": { temp: 12, condition: "비", humidity: 80 }
    };

    const weather = mockWeatherData[city] || { temp: 20, condition: "정보 없음", humidity: 50 };
    const temp = unit === "fahrenheit" ? (weather.temp * 9/5) + 32 : weather.temp;
    
    return {
      success: true,
      data: {
        city,
        temperature: `${temp}°${unit === "fahrenheit" ? "F" : "C"}`,
        condition: weather.condition,
        humidity: `${weather.humidity}%`
      }
    };
  },

  calculator: async (args) => {
    try {
      const { expression } = args;
      
      // 안전한 수식 계산 (eval 대신 제한된 연산만 허용)
      const sanitizedExpression = expression
        .replace(/[^0-9+\-*/().\s]/g, '')
        .replace(/\s+/g, '');
      
      // 기본 수학 함수들
      const mathFunctions = {
        sqrt: Math.sqrt,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        log: Math.log,
        abs: Math.abs,
        round: Math.round,
        floor: Math.floor,
        ceil: Math.ceil
      };

      let result;
      if (sanitizedExpression.includes('sqrt')) {
        const match = sanitizedExpression.match(/sqrt\(([^)]+)\)/);
        if (match) {
          const value = parseFloat(match[1]);
          result = Math.sqrt(value);
        }
      } else {
        result = Function(`"use strict"; return (${sanitizedExpression})`)();
      }

      return {
        success: true,
        data: {
          expression,
          result: result.toString()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: "계산 오류가 발생했습니다."
      };
    }
  },

  get_current_time: async (args) => {
    const { timezone = "Asia/Seoul", format = "24h" } = args;
    
    try {
      const now = new Date();
      const options = {
        timeZone: timezone,
        hour12: format === "12h",
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      
      const timeString = now.toLocaleString('ko-KR', options);
      
      return {
        success: true,
        data: {
          timezone,
          format,
          currentTime: timeString,
          timestamp: now.getTime()
        }
      };
    } catch (error) {
      return {
        success: false,
        error: "시간 조회 오류가 발생했습니다."
      };
    }
  },

  save_note: async (args) => {
    const { title, content, tags = [] } = args;
    
    try {
      // 로컬 스토리지에 메모 저장
      const notes = JSON.parse(localStorage.getItem('chatbot_notes') || '[]');
      const newNote = {
        id: Date.now(),
        title,
        content,
        tags,
        createdAt: new Date().toISOString()
      };
      
      notes.push(newNote);
      localStorage.setItem('chatbot_notes', JSON.stringify(notes));
      
      return {
        success: true,
        data: {
          message: "메모가 성공적으로 저장되었습니다.",
          noteId: newNote.id
        }
      };
    } catch (error) {
      return {
        success: false,
        error: "메모 저장 중 오류가 발생했습니다."
      };
    }
  },

  web_search: async (args) => {
    const { query, limit = 5 } = args;
    
    // 실제 환경에서는 검색 API를 호출
    // 여기서는 모의 검색 결과 반환
    const mockResults = [
      {
        title: `${query}에 대한 검색 결과 1`,
        url: "https://example.com/1",
        snippet: `${query}와 관련된 유용한 정보를 제공합니다.`
      },
      {
        title: `${query}에 대한 검색 결과 2`,
        url: "https://example.com/2",
        snippet: `${query}에 대한 자세한 설명과 예시를 확인할 수 있습니다.`
      }
    ];

    return {
      success: true,
      data: {
        query,
        results: mockResults.slice(0, limit),
        totalResults: mockResults.length
      }
    };
  }
};

// 사용 가능한 모든 함수 목록
export const availableFunctions = [
  getWeatherInfo,
  calculator,
  getCurrentTime,
  saveNote,
  webSearch
];
