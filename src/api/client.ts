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

// [로그 코드] - 요청(Request)을 서버로 보내기 전에 찍는 로그
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

// [토큰 자동 갱신 코드 ] - 갱신을 기다리는 대기열(Queue) 설정
// 여러 API가 동시에 401 에러를 냈을 때, 토큰 재발급을 딱 한 번만 하도록 도와주는 변수들
let isRefreshing = false; // 현재 토큰을 갱신 중인지 확인하는 상태값
let refreshSubscribers: ((token?: string) => void)[] = []; // 갱신되는 동안 기다리는 기존 요청들

const onRefreshed = () => {
    refreshSubscribers.forEach((cb) => cb());
    refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: () => void) => {
    refreshSubscribers.push(cb);
};

// [응답(Response) 인터셉터]
client.interceptors.response.use(
    (response) => {
        // [로그 코드] - API 응답이 성공(200번대)했을 때 찍는 로그
        console.group(`[API Success] ${response.config.method?.toUpperCase()} ${response.config.url}`);
        console.log('Status:', response.status);
        console.log('Data:', response.data);
        console.groupEnd();
        
        return response;
    },

    async (error) => {
        const { config, response } = error;
        const originalRequest = config; // 실패한 원래의 API 요청 정보

        // [토큰 자동 갱신 코드] - (401 에러 발생 시 처리)
        // 만약 Access Token이 만료되어서 401 에러가 났고, 한 번도 재시도한 적 없는 요청이라면
        if (response && response.status === 401 && !originalRequest._retry) {
            
            // 토큰 갱신 API 자체에서 401이 났다면 (리프레시 토큰까지 만료된 상황)
            if (originalRequest.url === '/auth/refresh') {
                window.location.href = '/login'; // 로그인 페이지로 쫓아냄
                return Promise.reject(error);
            }

            // 이미 다른 API 요청 때문에 토큰 갱신이 진행 중이라면, 잠시 대기열에 추가
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber(() => {
                        resolve(client(originalRequest)); // 갱신 완료 후 원래 요청 재시도
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // 백엔드로 리프레시 토큰을 보내서 새로운 Access Token을 발급받음
                await axios.post(`${baseURL}/auth/refresh`, {}, {
                    withCredentials: true 
                });

                isRefreshing = false; // 갱신 성공
                onRefreshed(); // 기다리던 다른 API 요청들도 일괄 재시도 처리

                // 처음에 실패했던 현재 요청을 다시 전송
                return client(originalRequest);

            } catch (refreshError) {
                // 리프레시 토큰마저 만료되어서 갱신에 실패한 경우
                isRefreshing = false;
                refreshSubscribers = [];
                
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = '/login'; // 로그인 페이지로 이동
                return Promise.reject(refreshError);
            }
        }

        // [로그 코드] - API 응답이 실패(401 이외의 4xx, 5xx 에러)했을 때 찍는 에러 로그
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

        // 에러를 그대로 던져서 개별 API를 호출하는 컴포넌트 단(try-catch)에서도 처리
        return Promise.reject(error);
    }
);

export default client;