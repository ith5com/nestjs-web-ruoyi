import http from "@/api";
import { System } from "@/api/interface/system";
import { SYSTEM_PORT } from "@/api/config/servicePort";

/**
 * @name 用户模块
 */
// * 获取用户列表
export const getUserListApi = (params: System.ReqUserList) => {
	return http.get<System.ResUserList>(SYSTEM_PORT + `/user`, params);
};

// * 新增用户
export const addUserApi = (params: System.ReqUserList) => {
	return http.post<System.ResUserList>(SYSTEM_PORT + `/user`, params);
};

// * 修改用户
export const editUserApi = (id: string, params: System.ReqUserList) => {
	return http.put<System.ResUserList>(SYSTEM_PORT + `/user/${id}`, params);
};

// * 删除用户
export const deleteUserApi = (id: string) => {
	return http.delete<System.ResUserList>(SYSTEM_PORT + `/user/${id}`);
};

// * 批量删除用户
export const deleteUserBatchApi = (ids: number[]) => {
	return http.post<System.ResUserList>(SYSTEM_PORT + `/user/batch`, { ids });
};
