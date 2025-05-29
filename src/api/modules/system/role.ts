import http from "@/api";
import { System } from "@/api/interface/system";
import { SYSTEM_PORT } from "@/api/config/servicePort";

/**
 * @name 角色模块
 */
// * 获取所有角色
export const getRoleListApi = (params: System.ReqRoleList) => {
	return http.get<System.ResRoleList>(SYSTEM_PORT + `/role`, params);
};

// * 获取角色下拉
export const getRoleSelectApi = () => {
	return http.get<System.ResRoleSelect>(SYSTEM_PORT + `/role/options`);
};

// 删除角色
export const deleteRole = (params: { id: string }) => {
	return http.delete(`${SYSTEM_PORT}/role/${params.id}`);
};

// 新增角色
export const addRole = (params: any) => {
	return http.post(`${SYSTEM_PORT}/role`, params);
};

// 编辑角色
export const editRole = (id: string, params: any) => {
	return http.put(`${SYSTEM_PORT}/role/${id}`, params);
};
