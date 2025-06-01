import http from "@/api";
import { SYSTEM_PORT } from "@/api/config/servicePort";
import { System } from "@/api/interface/system";

export const getPermissionOptionsApi = () => {
	return http.get<System.ResPermissionSelect>(SYSTEM_PORT + `/menu/options`);
};

// 新增菜单
export const addMenuApi = (data: System.ReqMenuAdd) => {
	return http.post<System.ResMenuAdd>(SYSTEM_PORT + `/menu`, data);
};

// 获取菜单
export const getMenuListApi = (params: System.ReqMenuList) => {
	return http.get<System.ResMenuList>(SYSTEM_PORT + `/menu`, params);
};

// 删除菜单
export const deleteMenuApi = (id: string) => {
	return http.delete(`${SYSTEM_PORT}/menu/${id}`);
};

// 跟新菜单
export const updateMenuApi = (id: string, data: System.ReqMenuAdd) => {
	return http.put(`${SYSTEM_PORT}/menu/${id}`, data);
};
