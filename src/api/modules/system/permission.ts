import http from "@/api";
import { SYSTEM_PORT } from "@/api/config/servicePort";
import { System } from "@/api/interface/system";

export const getPermissionOptionsApi = () => {
	return http.get<System.ResPermissionSelect>(SYSTEM_PORT + `/menu/options`);
};
