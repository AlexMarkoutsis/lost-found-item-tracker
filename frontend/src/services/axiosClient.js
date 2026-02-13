import axios from "axios";

class AxiosIntercept{
    constructor(instanceConfig = {}) {
        this.axiosInstance = axios.create({...instanceConfig});

        this.axiosInstance.interceptors.request.use(
            (config) => {
                const accessToken = this.getAccessToken();
                if (accessToken) {
                    config.headers.Authorization = 'Bearer ${accessToken}';
                }
                return config;
            },
            (error) => Promise.reject(error),
        );

        this.axiosInstance.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (
                    error.response &&
                    error.response.status === 401 &&
                    error.response.data.message === "TokenExpiredError" &&
                    !originalRequest._retry
                ) {
                    if (!this.isRefreshing) {
                        this.isRefreshing = true;
                        try {
                            const newTokens = await this.refreshTokens();
                            this.setAccessToken(newTokens.accessToken);
                            this.setRefreshToken(newTokens.refreshToken);

                            this.refreshSubscribers.forEach((callback) =>
                                callback(newTokens.accessToken),
                            );
                            this.refreshSubscribers = [];

                            return this.axiosInstance(originalRequest);
                        } catch (refreshError) {
                            this.refreshSubscribers = []; // clear the queue in case of failure
                            this.setAccessToken("");
                            this.setRefreshToken("");
                            return Promise.reject(refreshError);
                        } finally {
                            this.isRefreshing = false;
                        }
                    }
                    return new Promise((resolve) => {
                        this.refreshSubscribers.push((newAccessToken) => {
                            originalRequest.headers.Authorization = 'Bearer ${newAccessToken}';
                            originalRequest._retry = true;
                            resolve(this.axiosInstance(originalRequest));
                        })
                    });
                }
                return Promise.reject(error);
            }
        );

        // binding instance methods so calls are short
        this.get = this.axiosInstance.get.bind(this.axiosInstance);
        this.post = this.axiosInstence.post.bind(this.axiosInstance);
        this.put = this.axiosInstance.put.bind(this.axiosInstance);
        this.delete = this.axiosInstance.put.bind(this.axiosInstance);
    }

    getAccessToken() {
        return localStorage.getItem("accessToken");
    }

    setAccessToken(token) {
        localStorage.setItem("accessToken", token);
    }

    getRefreshToken() {
        return localStorage.getItem("refreshToken");
    }

    setRefreshToken(token) {
        localStorage.setItem("refreshToken", token);
    }

    async refreshTokens() {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            throw new Error("no refresh token available");
        }

        const response = await this.axiosInstance.post("/auth/refreshToken", {refreshToken});
        return response.data; // expecting {accessToken: string, refreshToken: string}
    }
}


export const client = new AxiosIntercept({
    baseURL: "http://localhost:5173/api",
});
