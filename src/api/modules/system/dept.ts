import http from "@/api";
import { System } from "@/api/interface/system";
import { SYSTEM_PORT } from "@/api/config/servicePort";

/**
 * @name 部门模块
 */
// * 获取部门树
export const getDeptTreeApi = () => {
	return http.get<System.ResDeptTree>(SYSTEM_PORT + `/dept/tree`);
};
