import { Button, Col, Form, Input, Row, Select, Space, Table, Tag, message, Modal } from "antd";
import { UpCircleFilled, PlusOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import { getRoleListApi, deleteRole } from "@/api/modules/system/role";
import type { TablePaginationConfig } from "antd/es/table";
import { System } from "@/api/interface/system";
import dayjs from "dayjs";
import AddRoleModal from "./components/AddRoleModal";
import EditRoleModal from "./components/EditRoleModal";

interface RoleData {
	id: string;
	name: string;
	code: string;
	remark: string;
	status: number;
	createTime: string;
}

const Role = () => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [tableData, setTableData] = useState<RoleData[]>([]);
	const [editRoleData, setEditRoleData] = useState<RoleData | undefined>(undefined);
	const [pagination, setPagination] = useState<TablePaginationConfig>({
		current: 1,
		pageSize: 10,
		total: 0
	});
	const [addModalVisible, setAddModalVisible] = useState(false);
	const [editModalVisible, setEditModalVisible] = useState(false);

	const formFileds = [
		{
			label: "角色名称",
			name: "name",
			placeholder: "请输入角色名称"
		},
		{
			label: "角色编码",
			name: "code",
			placeholder: "请输入角色编码"
		},
		{
			label: "备注",
			name: "remark",
			placeholder: "请输入备注"
		},
		{
			label: "状态",
			name: "status",
			placeholder: "请选择状态",
			Component: Select,
			options: [
				{ label: "启用", value: 1 },
				{ label: "禁用", value: 0 }
			]
		}
	];

	const columns = [
		{
			title: "角色名称",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "角色编码",
			dataIndex: "code",
			key: "code"
		},
		{
			title: "备注",
			dataIndex: "remark",
			key: "remark"
		},
		{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (status: number) => <Tag color={status === 1 ? "green" : "red"}>{status === 1 ? "启用" : "禁用"}</Tag>
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
			key: "createdAt",
			render: (createdAt: string) => dayjs(createdAt).format("YYYY-MM-DD HH:mm:ss")
		},
		{
			title: "操作",
			key: "action",
			render: (_: any, record: RoleData) => (
				<Space size="middle">
					<Button
						type="link"
						className="p-0"
						onClick={() => {
							handleEdit(record);
						}}
					>
						编辑
					</Button>
					<Button type="link" danger className="p-0" onClick={() => confirmDelete(record.id)}>
						删除
					</Button>
				</Space>
			)
		}
	];

	// 获取角色列表
	const getRoleData = async (params: System.ReqRoleList) => {
		try {
			setLoading(true);
			const res = await getRoleListApi(params);
			setTableData(res.data?.list || []);
			setPagination({
				...pagination,
				total: res.data?.total || 0
			});
		} catch (error) {
			console.error("获取角色列表失败:", error);
			message.error("获取角色列表失败");
		} finally {
			setLoading(false);
		}
	};

	// 表格分页变化
	const handleTableChange = (pagination: TablePaginationConfig) => {
		const params: System.ReqRoleList = {
			...form.getFieldsValue(),
			page: (pagination.current ?? 1) as number,
			pageSize: (pagination.pageSize ?? 10) as number
		};
		getRoleData(params);
	};

	// 重置
	const handleReset = () => {
		form.resetFields();
		getRoleData({
			page: 1,
			pageSize: pagination.pageSize ?? 10
		});
	};

	// 搜索
	const handleSearch = () => {
		const params: System.ReqRoleList = {
			...form.getFieldsValue(),
			page: 1,
			pageSize: pagination.pageSize
		};
		getRoleData(params);
	};

	// 新增角色成功回调
	const handleAddSuccess = () => {
		setAddModalVisible(false);
		message.success("新增角色成功");
		getRoleData({
			page: 1,
			pageSize: pagination.pageSize ?? 10
		});
	};

	// 编辑角色成功回调
	const handleEditSuccess = () => {
		setEditModalVisible(false);

		message.success("编辑角色成功");
		getRoleData({
			page: 1,
			pageSize: pagination.pageSize ?? 10
		});
	};

	// 删除角色
	const handleDelete = async (id: string) => {
		try {
			await deleteRole({ id });
			message.success("删除角色成功");
			getRoleData({
				page: pagination.current ?? 1,
				pageSize: pagination.pageSize ?? 10
			});
		} catch (error) {
			console.error("删除角色失败:", error);
			message.error("删除角色失败");
		}
	};
	// 编辑角色
	const handleEdit = (record: RoleData) => {
		setEditModalVisible(true);
		setEditRoleData(record);
	};

	// 确认删除
	const confirmDelete = (id: string) => {
		Modal.confirm({
			title: "确认删除",
			content: "确定要删除该角色吗？",
			onOk: () => handleDelete(id)
		});
	};

	// 初始化
	useEffect(() => {
		getRoleData({
			page: 1,
			pageSize: 10
		});
	}, []);

	return (
		<div>
			<div className="bg-white rounded-md shadow-sm p-4">
				<Form form={form} fields={formFileds} labelCol={{ span: 6 }}>
					<Row gutter={8}>
						{formFileds.map(item => (
							<Col span={8} key={item.name}>
								<Form.Item name={item.name} label={item.label}>
									{item.Component ? (
										<item.Component allowClear options={item.options} placeholder={item.placeholder} />
									) : (
										<Input allowClear placeholder={item.placeholder} />
									)}
								</Form.Item>
							</Col>
						))}
						<Col span={(3 - (formFileds.length % 3)) * 8} className="text-right">
							<Space>
								<Button type="default" onClick={handleReset} className="hover:bg-gray-100">
									重置
								</Button>
								<Button type="primary" onClick={handleSearch} className="hover:bg-blue-600">
									查询
								</Button>

								{formFileds.length > 6 && (
									<Button type="link" className="hover:text-blue-500">
										收起
										<UpCircleFilled className="ml-1" />
									</Button>
								)}
							</Space>
						</Col>
					</Row>
				</Form>
			</div>
			<div className="bg-white rounded-md shadow-sm p-4 mt-4">
				<div className="flex justify-between items-center p-4 pt-0 mb-2">
					<div></div>
					<div className="flex gap-2">
						<Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalVisible(true)}>
							新增角色
						</Button>
					</div>
				</div>
				<Table
					columns={columns}
					dataSource={tableData}
					rowKey="id"
					pagination={pagination}
					loading={loading}
					onChange={handleTableChange}
				/>
			</div>
			<AddRoleModal open={addModalVisible} onCancel={() => setAddModalVisible(false)} onSuccess={handleAddSuccess} />
			<EditRoleModal
				open={editModalVisible}
				onCancel={() => setEditModalVisible(false)}
				roleData={editRoleData}
				onSuccess={handleEditSuccess}
			/>
		</div>
	);
};

export default Role;
