import { Button, Col, Form, Input, Row, Space, Table, Tag } from "antd";
import { UpCircleFilled, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import AddMenu from "./components/add-menu";
// import IconFont from "@/components/IconFont";
import { getMenuListApi } from "@/api/modules/system/permission";

const Menu = () => {
	const [form] = Form.useForm();
	const [addMenuVisible, setAddMenuVisible] = useState(false);
	const [menuList, setMenuList] = useState<any[]>([]);
	const [pagination, setPagination] = useState({
		page: 1,
		pageSize: 10
	});
	const formFileds = [
		{
			label: "菜单名称",
			name: "name",
			placeholder: "请输入菜单名称"
		}
	];
	const handleReset = () => {
		form.resetFields();
	};
	const handleSearch = () => {
		console.log(form.getFieldsValue());
	};
	const handleAddMenuOk = () => {
		setAddMenuVisible(false);
		form.resetFields();
		handleSearch();
	};

	const getMenuList = async () => {
		const { data } = await getMenuListApi({
			...form.getFieldsValue(),
			...pagination
		});
		if (data) {
			setMenuList(data.list);
		}
	};

	const handleTableChange = (newPagination: any) => {
		setPagination(newPagination);
		getMenuList();
	};

	const columns = [
		{
			title: "菜单名称",
			dataIndex: "name",
			key: "name"
		},
		{
			title: "菜单类型",
			dataIndex: "type",
			key: "type",
			render: (text: number) => {
				return text === 0 ? (
					<Tag color="blue">目录</Tag>
				) : text === 1 ? (
					<Tag color="green">菜单</Tag>
				) : (
					<Tag color="orange">按钮</Tag>
				);
			}
		},
		{
			title: "菜单路径",
			dataIndex: "path"
		}
	];

	useEffect(() => {
		getMenuList();
	}, []);

	return (
		<div>
			<div className="bg-white rounded-md shadow-sm p-4">
				<Form form={form}>
					<Row gutter={12}>
						{formFileds.map(item => (
							<Col span={8} key={item.name}>
								<Form.Item name={item.name} label={item.label}>
									<Input allowClear placeholder={item.placeholder} />
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
			</div>
			<div className="bg-white rounded-md shadow-sm p-4 mt-4">
				<div className="flex justify-between items-center p-4 pt-0 mb-2">
					<div></div>
					<div className="flex gap-2">
						<Button type="primary" icon={<PlusOutlined />} onClick={() => setAddMenuVisible(true)}>
							新增
						</Button>
					</div>
				</div>
				<Table columns={columns} dataSource={menuList} pagination={pagination} onChange={handleTableChange} />
			</div>

			<AddMenu open={addMenuVisible} onCancel={() => setAddMenuVisible(false)} onOk={handleAddMenuOk} />
		</div>
	);
};

export default Menu;
