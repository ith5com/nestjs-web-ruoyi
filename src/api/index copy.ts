import NProgress from "@/config/nprogress";
import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { showFullScreenLoading, tryHideFullScreenLoading } from "@/config/serviceLoading";
import { ResultData } from "@/api/interface";
import { ResultEnum } from "@/enums/httpEnum";
import { checkStatus } from "./helper/checkStatus";
import { AxiosCanceler } from "./helper/axiosCancel";
import { setRefreshToken, setToken } from "@/redux/modules/global/action";
import { message } from "antd";
import { store } from "@/redux";
import { refreshTokenApi } from "@/api/modules/login";

const axiosCanceler = new AxiosCanceler();

const config = {
	baseURL: import.meta.env.VITE_API_URL as string,
	timeout: 10000,
	withCredentials: true
};

let isRefreshing = false;
let requests: Array<(token: string) => void> = [];

function cloneConfig(config: any) {
	const newConfig = { ...config };
	if (config.headers) newConfig.headers = { ...config.headers };
	if (config.params) newConfig.params = { ...config.params };
	if (config.data) newConfig.data = config.data;
	return newConfig;
}

class RequestHttp {
	service: AxiosInstance;

	constructor(config: AxiosRequestConfig) {
		this.service = axios.create(config);

		/** 请求拦截器 */
		this.service.interceptors.request.use(
			(config: AxiosRequestConfig) => {
				NProgress.start();

				// 🛡️ 避免重发请求被 axiosCanceler 误杀
				if (!(config as any)._retry) {
					axiosCanceler.addPending(config);
				}

				config.headers!.noLoading || showFullScreenLoading();
				const token = store.getState().global.token;
				return {
					...config,
					headers: { ...config.headers, Authorization: `Bearer ${token}` }
				};
			},
			(error: AxiosError) => Promise.reject(error)
		);

		/** 响应拦截器 */
		this.service.interceptors.response.use(
			async (response: AxiosResponse) => {
				const { data, config } = response;
				NProgress.done();
				axiosCanceler.removePending(config);
				tryHideFullScreenLoading();

				if (data.code === 401) {
					// token过期，准备刷新
					return this.handleTokenRefresh(config);
				}

				if (data.code === ResultEnum.OVERDUE) {
					this.handleLogout(data.msg);
					return Promise.reject(data);
				}

				if (data.code && data.code !== ResultEnum.SUCCESS) {
					message.error(data.msg);
					return Promise.reject(data);
				}

				return data;
			},
			async (error: AxiosError) => {
				const { response } = error;
				NProgress.done();
				tryHideFullScreenLoading();

				if (error.message.includes("timeout")) {
					message.error("请求超时，请稍后再试");
				}

				if (response) checkStatus(response.status);
				else if (!window.navigator.onLine) {
					window.location.hash = "/500";
				}

				return Promise.reject(error);
			}
		);
	}

	/** token 刷新处理逻辑 */
	private async handleTokenRefresh(config: AxiosRequestConfig): Promise<any> {
		if (!isRefreshing) {
			isRefreshing = true;
			const refreshToken = store.getState().global.refreshToken;

			try {
				const refreshRes = await refreshTokenApi(refreshToken);
				const newToken = refreshRes.data?.accessToken;

				if (refreshRes.code === 200 && newToken) {
					store.dispatch(setToken(newToken));
					store.dispatch(setRefreshToken(refreshRes.data.refreshToken || ""));

					// 处理等待队列
					requests.forEach(cb => cb(newToken));
					requests = [];
					isRefreshing = false;

					// 重试当前请求
					const retryConfig = cloneConfig(config);
					retryConfig.headers = retryConfig.headers || {};
					retryConfig.headers["Authorization"] = `Bearer ${newToken}`;
					(retryConfig as any)._retry = true;
					return this.service(retryConfig);
				} else {
					this.handleLogout("登录已过期，请重新登录");
					return Promise.reject(refreshRes);
				}
			} catch (error) {
				this.handleLogout("登录已过期，请重新登录");
				return Promise.reject(error);
			}
		}

		// 挂起请求，等待 token 刷新
		return new Promise(resolve => {
			requests.push((token: string) => {
				const retryConfig = cloneConfig(config);
				retryConfig.headers = retryConfig.headers || {};
				retryConfig.headers["Authorization"] = `Bearer ${token}`;
				(retryConfig as any)._retry = true;
				resolve(this.service(retryConfig));
			});
		});
	}

	/** 登录失效统一处理 */
	private handleLogout(msg: string) {
		isRefreshing = false;
		requests = [];
		store.dispatch(setToken(""));
		store.dispatch(setRefreshToken(""));
		message.error(msg);
		window.location.hash = "/login";
	}

	// 常用请求方法
	get<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.get(url, { params, ..._object });
	}
	post<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.post(url, params, _object);
	}
	put<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
		return this.service.put(url, params, _object);
	}
	delete<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
		return this.service.delete(url, { params, ..._object });
	}
}

export default new RequestHttp(config);
