import { Button, Col, Form, Input, message, Popconfirm, Row, Select, Space, Table, Tag, Tree } from "antd";
import { UpCircleFilled, PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import "./index.less";
import { useEffect, useState } from "react";
import { deleteUserApi, getUserListApi, deleteUserBatchApi } from "@/api/modules/system/user";
import { getDeptTreeApi } from "@/api/modules/system/dept";
import dayjs from "dayjs";
import AddUser from "./components/add-user";

const User = () => {
	const [dataSource, setDataSource] = useState([]);
	const [deptData, setDeptData] = useState<any>([]);
	const [deptId, setDeptId] = useState<any>(null);
	const [pagination, setPagination] = useState({
		current: 1,
		pageSize: 10,
		total: 0
	});
	const [addUserVisible, setAddUserVisible] = useState(false);
	const [editData, setEditData] = useState<any>(null);
	const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
	const [form] = Form.useForm();
	const formFileds = [
		{
			label: "用户名",
			name: "username",
			placeholder: "请输入用户名"
		},
		{
			label: "手机号",
			name: "phone",
			placeholder: "请输入手机号"
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
			title: "用户名",
			dataIndex: "username"
		},
		{
			title: "手机号",
			dataIndex: "phone"
		},
		{
			title: "状态",
			dataIndex: "status",
			render: (text: number) => {
				return text === 1 ? <Tag color="success">启用</Tag> : <Tag color="error">禁用</Tag>;
			}
		},
		{
			title: "部门",
			dataIndex: "deptName",
			render: (_, record: any) => {
				return <Tag color="blue">{record.dept?.name}</Tag>;
			}
		},
		{
			title: "创建时间",
			dataIndex: "createdAt",
			render: (text: string) => {
				return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
			}
		},
		{
			title: "更新时间",
			dataIndex: "updatedAt",
			render: (text: string) => {
				return dayjs(text).format("YYYY-MM-DD HH:mm:ss");
			}
		},
		{
			title: "操作",
			dataIndex: "action",
			render: (_, record: any) => {
				return (
					<Space>
						<Button type="link" onClick={() => handleEdit(record)}>
							编辑
						</Button>

						<Popconfirm
							title="确定删除吗？"
							onConfirm={() => {
								handleDelete(record.id);
							}}
							okText="确定"
							cancelText="取消"
						>
							<Button type="link">删除</Button>
						</Popconfirm>
					</Space>
				);
			}
		}
	];
	/**
	 * 获取用户列表
	 */
	const getUserList = async (pageParams = pagination) => {
		let params = form.getFieldsValue();
		const { data } = await getUserListApi({
			...params,
			deptId,
			page: pageParams.current,
			pageSize: pageParams.pageSize
		});
		setDataSource(data?.list || []);
		setPagination({
			...pageParams,
			total: data?.total || 0
		});
	};
	/**
	 * 删除用户
	 */
	const handleDelete = async (id: string) => {
		try {
			await deleteUserApi(id);
			message.success("删除成功");
			getUserList();
		} catch (error) {
			console.log("删除失败:", error);
		}
	};
	/**
	 * 批量删除用户
	 */
	const handleBatchDelete = async () => {
		try {
			await deleteUserBatchApi(selectedRowKeys);
			message.success("批量删除成功");
			setSelectedRowKeys([]);
			getUserList();
		} catch (error) {
			console.log("批量删除失败:", error);
		}
	};
	/**
	 * 表格选择项变化
	 */
	const handleTableSelectChange = (newSelectedRowKeys: string[]) => {
		setSelectedRowKeys(newSelectedRowKeys);
	};
	/**
	 * 获取部门树
	 */
	const getDeptTree = async () => {
		const { data } = await getDeptTreeApi();
		console.log("data", data);
		setDeptData(data);
	};
	/**
	 * 处理分页变化
	 */
	const handleTableChange = (newPagination: any) => {
		getUserList(newPagination);
	};
	/**
	 * 搜索
	 */
	const handleSearch = () => {
		getUserList({
			...pagination,
			current: 1
		});
	};

	/**
	 * 重置
	 */
	const handleReset = () => {
		form.resetFields();
		getUserList({
			...pagination,
			current: 1
		});
	};
	/**
	 * 处理部门树点击
	 */
	const handleDeptSelect = (selectedKeys: any) => {
		console.log("selectedKeys", selectedKeys);
		if (selectedKeys.length) {
			setDeptId(selectedKeys[0]);
		} else {
			setDeptId(null);
		}
	};
	/**
	 * 处理编辑
	 */
	const handleEdit = (record: any) => {
		setEditData(record);
		setAddUserVisible(true);
	};
	/**
	 * 处理新增/编辑用户
	 */
	const handleAddUser = () => {
		setAddUserVisible(false);
		setEditData(null);
		getUserList();
	};
	/** */
	useEffect(() => {
		getUserList();
		getDeptTree();
	}, []);

	useEffect(() => {
		getUserList();
	}, [deptId]);
	return (
		<div className="system-user">
			<div className="dept">
				{deptData.length && (
					<Tree
						treeData={deptData}
						autoExpandParent={true}
						fieldNames={{ title: "name", key: "id", children: "children" }}
						onSelect={handleDeptSelect}
					/>
				)}
			</div>
			<div className="user">
				<Form form={form}>
					<Row gutter={12}>
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

						<Col span={(3 - (formFileds.length % 3)) * 8} style={{ textAlign: "right" }}>
							<Space>
								<Button type="default" onClick={handleReset}>
									重置
								</Button>
								<Button type="primary" onClick={handleSearch}>
									查询
								</Button>

								{formFileds.length > 6 && (
									<Button type="link">
										收起
										<UpCircleFilled />
									</Button>
								)}
							</Space>
						</Col>
					</Row>
				</Form>
				<div className="table-container">
					<div className="table-header">
						<div></div>
						<div className="optirion">
							<Space>
								<Button type="primary" icon={<PlusOutlined />} onClick={() => setAddUserVisible(true)}>
									新增
								</Button>
								<Popconfirm
									title="确定删除选中的用户吗？"
									onConfirm={handleBatchDelete}
									okText="确定"
									cancelText="取消"
									disabled={selectedRowKeys.length === 0}
								>
									<Button type="primary" danger icon={<DeleteOutlined />} disabled={selectedRowKeys.length === 0}>
										删除
									</Button>
								</Popconfirm>
							</Space>
						</div>
					</div>
					<Table
						columns={columns}
						dataSource={dataSource}
						pagination={pagination}
						onChange={handleTableChange}
						rowKey="id"
						rowSelection={{
							type: "checkbox",
							selectedRowKeys,
							onChange: handleTableSelectChange
						}}
					/>
				</div>
			</div>
			<AddUser
				open={addUserVisible}
				onCancel={() => {
					setAddUserVisible(false);
					setEditData(null);
				}}
				onOk={handleAddUser}
				title={editData ? "编辑用户" : "新增用户"}
				editData={editData}
			/>
		</div>
	);
};

export default User;
