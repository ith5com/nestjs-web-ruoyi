import React from "react";
import lazyLoad from "@/routers/utils/lazyLoad";
import { LayoutIndex } from "@/routers/constant";
import { RouteObject } from "@/routers/interface";

// personnel 模块
const personnelRouter: Array<RouteObject> = [
	{
		element: <LayoutIndex />,
		meta: {
			title: "人事管理"
		},
		children: [
			{
				path: "/personnel/dept",
				element: lazyLoad(React.lazy(() => import("@/views/personnel/dept/index"))),
				meta: {
					requiresAuth: true,
					title: "部门管理",
					key: "dept"
				}
			},
			{
				path: "/personnel/staff",
				element: lazyLoad(React.lazy(() => import("@/views/personnel/staff/index"))),
				meta: {
					requiresAuth: true,
					title: "员工管理",
					key: "staff"
				}
			}
		]
	}
];

export default personnelRouter;
