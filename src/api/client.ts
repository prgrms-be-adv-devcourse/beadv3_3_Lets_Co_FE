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

/* ==========================================================
   [토큰 자동 갱신 코드 비활성화] 
   당장 사용하지 않으므로 변수 및 대기열 함수 전체 주석 처리
========================================================== */
/*
let isRefreshing = false; 
let refreshSubscribers: ((token?: string) => void)[] = []; 

const onRefreshed = () => {
    refreshSubscribers.forEach((cb) => cb());
    refreshSubscribers = [];
};

const addRefreshSubscriber = (cb: () => void) => {
    refreshSubscribers.push(cb);
};
*/

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

        if (response.status === 401) {

            const isAuthCheckApi = config.url?.includes('/users/my');

            if (!isAuthCheckApi) {
            alert("인증토큰이 만료되었습니다.");
            window.location.href = '/login'; 
        }
        }
        

        // const originalRequest = config; // 토큰 갱신

        /* ==========================================================
           401 에러 발생 시 /auth/refresh 로 재시도하는 로직 차단
        ========================================================== */
        /*
        if (response && response.status === 401 && !originalRequest._retry) {
            
            if (originalRequest.url === '/auth/refresh') {
                window.location.href = '/login'; 
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve) => {
                    addRefreshSubscriber(() => {
                        resolve(client(originalRequest)); 
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axios.post(`${baseURL}/auth/refresh`, {}, {
                    withCredentials: true 
                });

                isRefreshing = false; 
                onRefreshed(); 

                return client(originalRequest);

            } catch (refreshError) {
                isRefreshing = false;
                refreshSubscribers = [];
                
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                window.location.href = '/login'; 
                return Promise.reject(refreshError);
            }
        }
        */

        // [로그 코드] - API 응답이 실패(4xx, 5xx 에러)했을 때 찍는 에러 로그
        console.group(`[API Error] ${config?.method?.toUpperCase()} ${config?.url}`);
        
        if (response) {
            // 상태 코드가 4xx, 5xx인 경우
            console.error(`Status: ${response.status}`);
            console.error('Error Data:', response.data);
        } else if (error.request) {
            // 서버에서 전혀 응답이 없는 경우
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