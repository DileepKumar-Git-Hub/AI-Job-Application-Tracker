import axios from 'axios';


// BACKEND BASE URL
const BASE_URL = import.meta.env.VITE_BACKEND_BASE_API || 'http://127.0.0.1:8000/api/v1';


// CREATE AXIOS INSTANCE
const axiosInstance = axios.create({
    baseURL: BASE_URL,
});


// REQUEST INTERCEPTOR
// Automatically attach access token
axiosInstance.interceptors.request.use(

    (config) => {

        const accessToken =
            localStorage.getItem('access_token');

        // ADD TOKEN TO HEADERS
        if (accessToken) {

            config.headers.Authorization =
                `Bearer ${accessToken}`;
        }

        console.log(
            'Request Sent:',
            config
        );

        return config;
    },

    (error) => {

        return Promise.reject(error);
    }
);


// RESPONSE INTERCEPTOR
// Automatically refresh expired token
axiosInstance.interceptors.response.use(

    // SUCCESS RESPONSE
    (response) => {

        return response;
    },

    // ERROR RESPONSE
    async (error) => {

        const originalRequest = error.config;

        console.log(
            'Response Error:',
            error.response
        );

        // CHECK:
        // 401 ERROR
        // REQUEST NOT RETRIED
        // NOT REFRESH API ITSELF

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes(
                '/token/refresh/'
            )
        ) {

            originalRequest._retry = true;

            console.log(
                'Access token expired'
            );

            const refreshToken =
                localStorage.getItem(
                    'refresh_token'
                );

            // NO REFRESH TOKEN
            if (!refreshToken) {

                console.log(
                    'No refresh token found'
                );

                localStorage.removeItem(
                    'access_token'
                );

                localStorage.removeItem(
                    'refresh_token'
                );

                window.location.href =
                    '/login';

                return Promise.reject(error);
            }

            try {

                // REQUEST NEW ACCESS TOKEN
                const response =
                    await axios.post(

                        `${BASE_URL}/token/refresh/`,

                        {
                            refresh: refreshToken,
                        }
                    );

                console.log(
                    'New Access Token:',
                    response.data.access
                );

                // SAVE NEW ACCESS TOKEN
                localStorage.setItem(
                    'access_token',
                    response.data.access
                );

                // UPDATE AUTH HEADER
                originalRequest.headers.Authorization =
                    `Bearer ${response.data.access}`;

                // RETRY ORIGINAL REQUEST
                return axiosInstance(
                    originalRequest
                );

            } catch (refreshError) {

                console.log(
                    'Refresh Token Expired'
                );

                // REMOVE TOKENS
                localStorage.removeItem(
                    'access_token'
                );

                localStorage.removeItem(
                    'refresh_token'
                );

                // REDIRECT TO LOGIN
                window.location.href =
                    '/login';

                return Promise.reject(
                    refreshError
                );
            }
        }

        return Promise.reject(error);
    }
);


export default axiosInstance;