import { ReqPage } from ".";

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

	export interface ReqRoleList extends ReqPage {
		name?: string;
		code?: string;
		remark?: string;
		status?: number;
	}

	export interface ResRoleList {
		list: RoleData[];
		total: number;
	}

	export interface ResRoleSelect {
		code: number;
		msg: string;
		data: { label: string; value: string }[];
	}

	export interface RoleData {
		id: string;
		name: string;
		code: string;
		remark: string;
		status: number;
		createTime: string;
		menus?: string[];
	}

	export interface ResPermissionSelect {
		code: number;
		msg: string;
		data: {
			key: string;
			title: string;
			children?: {
				key: string;
				title: string;
			}[];
		}[];
	}

	export interface ReqMenuAdd {
		type: number;
		name: string;
		path: string;
		parentId: string;
		permission: string;
		icon: string;
		sort: number;
		isLink: number;
		isShow: number;
		status: number;
	}

	export interface ResMenuAdd {
		code: number;
		msg: string;
		data: {
			id: string;
			name: string;
			path: string;
			component: string;
			permission: string;
			icon: string;
			sort: number;
			isLink: number;
			isShow: number;
			status: number;
			type: number;
			parentId: string;
			createAt: string;
			updateAt: string;
		};
	}

	export interface ReqMenuList extends ReqPage {
		name?: string;
		path?: string;
		permission?: string;
		type?: number;
		parentId?: string;
	}

	export interface ResMenuList {
		list: MenuData[];
		page: number;
		pageSize: number;
		total: number;
	}

	export interface MenuData {
		id: string;
		name: string;
		path: string;
		permission: string;
		icon: string;
		sort: number;
		isLink: number;
		isShow: number;
	}
}
