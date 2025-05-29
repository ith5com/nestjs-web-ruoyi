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
