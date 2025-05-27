import http from "@/api";
import { System } from "@/api/interface/system";
import { SYSTEM_PORT } from "@/api/config/servicePort";

/**
 * @name 角色模块
 */
// * 获取所有角色
export const getRoleListApi = () => {
	return http.get<System.ResRoleList>(SYSTEM_PORT + `/role`);
};

// * 获取角色下拉
export const getRoleSelectApi = () => {
	return http.get<System.ResRoleSelect>(SYSTEM_PORT + `/role/options`);
};
