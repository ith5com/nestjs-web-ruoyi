// * 系统
export namespace System {
	export interface ReqUserList {
		username: string;
		phone: string;
		status: number;
		page: number;
		pageSize: number;
	}
	export interface ResUserList {
		code: number;
		msg: string;
		data: {
			list: {
				username: string;
				phone: string;
				status: number;
			}[];
		};
	}

	export interface ResDeptTree {
		code: number;
		msg: string;
		data: {
			children: any[];
			code: string;
			id: string;
			name: string;
			parentId: string;
			orderNum: number;
		}[];
	}

	export interface ResRoleList {
		code: number;
		msg: string;
		data: {
			list: [];
		};
	}

	export interface ResRoleSelect {
		code: number;
		msg: string;
		data: { label: string; value: string }[];
	}
}
