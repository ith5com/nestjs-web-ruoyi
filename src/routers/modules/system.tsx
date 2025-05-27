import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// system 模块
const systemRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "系统管理"
		},
		children: [
			{
				path: "/system/user",
				element: lazyLoad(React.lazy(() => import("@/views/system/user/index"))),
				meta: {
					requiresAuth: true,
					title: "用户管理",
					key: "user"
				}
			},
			{
				path: "/system/role",
				element: lazyLoad(React.lazy(() => import("@/views/system/role/index"))),
				meta: {
					requiresAuth: true,
					title: "角色管理",
					key: "role"
				}
			},
			{
				path: "/system/menu",
				element: lazyLoad(React.lazy(() => import("@/views/system/menu/index"))),
				meta: {
					requiresAuth: true,
					title: "菜单管理",
					key: "menu"
				}
			}
		]
	}
];

export default systemRouter;
