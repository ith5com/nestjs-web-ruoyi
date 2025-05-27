import { Login } from "@/api/interface/index";
import { AUTH_PORT, ACCOUNT_PORT } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 登录模块
 */
// * 用户登录接口
export const loginApi = (params: Login.ReqLoginForm) => {
	return http.post<Login.ResLogin>(AUTH_PORT + `/login`, params);
};

// * 获取按钮权限
export const getAuthorButtons = () => {
	return http.get<Login.ResAuthButtons>(ACCOUNT_PORT + `/permissions`);
};

// * 获取用户菜单列表
export const getMenuList = () => {
	return http.get<Menu.MenuOptions[]>(ACCOUNT_PORT + `/menus`);
};

// * 刷新token接口
export const refreshTokenApi = (refreshToken: string) => {
	return http.post<Login.ResLogin>(AUTH_PORT + `/refresh-token`, { refreshToken });
};
