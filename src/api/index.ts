import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";

import { message } from "antd";
import { setToken } from "@/redux/modules/global/action";
import { store } from "@/redux";
import { AUTH_PORT } from "./config/servicePort";
import qs from "qs";
import { ResultData } from "./interface";
// 是否正在刷新的标记
let isRefreshing = false;
// 重试队列，每一项将是一个待执行的函数形式
let requests = [] as any[];
// 创建axios实例
const service: AxiosInstance = axios.create({
	// 默认地址请求地址，可在 .env 开头文件中修改
	baseURL: import.meta.env.VITE_API_URL as string,
	// 设置超时时间（10s）
	timeout: 10000,
	// 跨域时候允许携带凭证
	withCredentials: true
});

// request拦截器
service.interceptors.request.use(
	(config: AxiosRequestConfig) => {
		if (config.method === "post" && config!.headers!["Content-Type"] === "application/x-www-form-urlencoded") {
			config.data = qs.stringify(config.data);
		}
		// 添加token，可根据实际业务修改
		const token: string = store.getState().global.token;
		if (token) {
			config!.headers!["Authorization"] = `Bearer ${token}`;
		}

		// get参数编码
		if (config.method === "get" && config.params) {
			let url = config.url as string;
			url += "?";
			const keys = Object.keys(config.params);
			for (const key of keys) {
				if (config.params[key] !== void 0 && config.params[key] !== null) {
					url += `${key}=${encodeURIComponent(config.params[key])}&`;
				}
			}
			url = url.substring(0, url?.length - 1);
			config.params = {};
			config.url = url;
		}
		return config;
	},
	(error: AxiosError) => {
		// Do something with request error
		console.log(error); // for debug
		Promise.reject(error);
	}
);

// response 拦截器
service.interceptors.response.use(
	(response: AxiosResponse<Recordable>) => {
		console.log("response", response.data);
		const config = response.config;
		if (response.headers.Authorization) {
			store.dispatch(setToken(response.headers.Authorization));
		}
		if (response.data.code === 500) {
			message.error(response.data.msg);
			return Promise.reject(response.data.msg);
		}
		console.log("response.data.code", response.data.code);
		if (response.data.code === 401) {
			if (!isRefreshing) {
				console.log("进来");
				isRefreshing = true;
				// return
				return service({
					url: AUTH_PORT + "/refresh-token",
					baseURL: import.meta.env.VITE_API_URL as string,
					method: "post",
					data: {
						refreshToken: store.getState().global.refreshToken
					},
					headers: {
						"Content-Type": "application/json"
					}
				})
					.then(res => {
						if (res.data.code === 500) {
							store.dispatch(setToken(""));
							message.error(res.data.msg);
							window.location.hash = "/login";
							return;
						}
						console.log("token", res);

						service.defaults.headers.common["Authorization"] = `Bearer ${res.data.accessToken}`;
						store.dispatch(setToken(res.data.accessToken));
						// userStore.setUserInfo(user)

						// 已经刷新了token，将所有队列中的请求进行重试
						requests.forEach(cb => cb(res.data.accessToken));
						// 重试完了别忘了清空这个队列（掘金评论区同学指点）
						requests = [];
						return service(config);
					})
					.catch(res => {
						console.error("refreshtoken error =>", res);
						store.dispatch(setToken(""));
						message.error(res.data.message);
						window.location.hash = "/login";
						return;
						// window.location.href = "/";
					})
					.finally(() => {
						isRefreshing = false;
					});
			} else {
				console.log("没进来");
				// 正在刷新token，返回一个未执行resolve的promise
				return new Promise(resolve => {
					// 将resolve放进队列，用一个函数形式来保存，等token刷新后直接执行
					requests.push((token: string) => {
						service.defaults.headers.common["Authorization"] = `Bearer ${token}`;
						resolve(service(config));
					});
				});
			}
		} else if (response.data.code !== "0") {
			return response.data;
		}
		return response.data;
	},
	(error: AxiosError) => {
		console.log("err" + error); // for debug
		message.error(error.message);
		return Promise.reject(error);
	}
);

function getFn<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
	return service.get(url, { params, ..._object });
}

function postFn<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
	return service.post(url, params, _object);
}

function deleteFn<T>(url: string, params?: any, _object = {}): Promise<ResultData<T>> {
	return service.delete(url, { params, ..._object });
}

function putFn<T>(url: string, params?: object, _object = {}): Promise<ResultData<T>> {
	return service.put(url, params, _object);
}

const Axios = () => {
	return {
		get: getFn,
		post: postFn,
		delete: deleteFn,
		put: putFn
	};
};
export default Axios();
