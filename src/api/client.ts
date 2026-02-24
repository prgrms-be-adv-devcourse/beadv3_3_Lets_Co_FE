import axios from "axios";

// 1. 개발 모드일 땐 '' (빈 문자열) -> Vite Proxy가 처리
// 2. 배포 모드일 땐 .env.production에 적힌 주소 사용 -> 백엔드로 직접 요청
const baseURL = import.meta.env.VITE_API_BASE_URL || '';

const client = axios.create({
    baseURL: baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

// --- [요청(Request) 인터셉터] ---
client.interceptors.request.use(
    (config) => {
        // 요청이 서버로 전송되기 전에 실행
        console.group(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
        console.log('Headers:', config.headers);
        // 비밀번호 등 민감한 데이터는 마스킹 처리
        if (config.data) console.log('Payload:', config.data);
        console.groupEnd();
        return config;
    },
    (error) => {
        // 요청 설정 중 에러가 발생한 경우
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    }
);

// --- [응답(Response) 인터셉터] ---
client.interceptors.response.use(
    (response) => {
        // 상태 코드가 2xx 범위일 때 실행 (성공)
        console.group(`[API Success] ${response.config.method?.toUpperCase()} ${response.config.url}`);
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        console.groupEnd();
        return response;
    },
    (error) => {
        // 상태 코드가 2xx 범위를 벗어날 때 실행 (에러 발생)
        const { config, response } = error;
        
        console.group(`[API Error] ${config?.method?.toUpperCase()} ${config?.url}`);
        
        if (response) {
            // 백엔드(Spring Boot)에서 응답을 보냈지만, 상태 코드가 4xx, 5xx인 경우
            // Spring Boot의 기본 에러 응답 포맷(timestamp, status, error, message 등)을 확인
            console.error(`Status: ${response.status}`);
            console.error('Error Data:', response.data);
        } else if (error.request) {
            // 요청은 만들어졌으나 서버에서 전혀 응답이 없는 경우 (네트워크 오류, 서버 다운, CORS 에러 등)
            console.error('No Response from server. Request details:', error.request);
        } else {
            // 요청 설정 자체에 문제가 있는 경우
            console.error('Error Message:', error.message);
        }
        console.groupEnd();

        // 에러를 그대로 던져서 개별 API를 호출하는 컴포넌트 단(try-catch)에서도 처리할 수 있게 합니다.
        return Promise.reject(error);
    }
);

export default client;