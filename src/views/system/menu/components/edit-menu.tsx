import { updateMenuApi, getPermissionOptionsApi } from "@/api/modules/system/permission";
import { Form, Input, message, Modal, Radio, RadioChangeEvent, TreeSelect } from "antd";
import { useEffect, useState } from "react";

export default function EditMenu(props: { open: boolean; onCancel: () => void; onOk: () => void; record: any }) {
	const { open, onCancel, onOk } = props;
	const [form] = Form.useForm();
	const [editMenuVisible, setEditMenuVisible] = useState(false);
	const [menuTree, setMenuTree] = useState<any[]>([]);
	const [type, setType] = useState(1);

	const getMenuTree = async () => {
		const { data } = await getPermissionOptionsApi();
		if (data) {
			setMenuTree(data);
		}
	};

	const handleMenuSelect = (value: string) => {
		console.log(value);
		form.setFieldsValue({
			parentId: value
		});
	};

	const handleTypeChange = (e: RadioChangeEvent) => {
		setType(e.target.value);
		form.setFieldsValue({
			type: e.target.value
		});
	};

	const handleSubmit = async () => {
		const values = await form.validateFields();

		await updateMenuApi(props.record.id, values);
		message.success("修改菜单成功");
		form.resetFields();
		setEditMenuVisible(false);
		onOk();
	};

	useEffect(() => {
		if (open) {
			setEditMenuVisible(true);
			form.setFieldsValue(props.record);
			getMenuTree();
		}
	}, [open]);
	return (
		<Modal
			visible={editMenuVisible}
			width={600}
			onCancel={() => {
				setEditMenuVisible(false);
				form.resetFields();
				onCancel();
			}}
			onOk={() => {
				handleSubmit();
			}}
		>
			<Form
				labelCol={{ span: 4 }}
				labelAlign="left"
				form={form}
				preserve={false}
				initialValues={{ type: 1, isShow: 1, isLink: 0, status: 1 }}
			>
				<Form.Item name="type" label="菜单类型" rules={[{ required: true, message: "请选择菜单类型" }]}>
					<Radio.Group onChange={handleTypeChange}>
						<Radio value={0}>目录</Radio>
						<Radio value={1}>菜单</Radio>
						<Radio value={2}>按钮</Radio>
					</Radio.Group>
				</Form.Item>
				<Form.Item name="name" label="菜单名称" rules={[{ required: true, message: "请输入菜单名称" }]}>
					<Input allowClear placeholder="请输入菜单名称" />
				</Form.Item>
				{type !== 2 && (
					<>
						<Form.Item name="path" label="路由路径" rules={[{ required: true, message: "请输入路由路径" }]}>
							<Input allowClear placeholder="请输入路由路径" />
						</Form.Item>
					</>
				)}

				<Form.Item name="parentId" label="父级菜单" rules={[{ required: true, message: "请选择父级菜单" }]}>
					<TreeSelect
						treeData={menuTree}
						fieldNames={{ label: "title", value: "key", children: "children" }}
						allowClear
						placeholder="请选择父级菜单"
						onSelect={handleMenuSelect}
					/>
				</Form.Item>

				{type !== 0 && (
					<Form.Item
						name="permission"
						label="权限标识"
						tooltip="对应控制器中定义的权限字符，如：@Permission('system:menu:list'))"
						rules={[{ required: true, message: "请输入权限标识" }]}
					>
						<Input allowClear placeholder="请输入权限标识" />
					</Form.Item>
				)}
				{type !== 2 && (
					<>
						<Form.Item name="icon" label="菜单图标" rules={[{ required: true, message: "请输入菜单图标" }]}>
							<Input allowClear placeholder="请输入菜单图标" />
						</Form.Item>
						<Form.Item name="sort" label="排序" rules={[{ required: true, message: "请输入排序" }]}>
							<Input placeholder="请输入排序" />
						</Form.Item>

						<Form.Item name="isLink" label="是否外链" rules={[{ required: true, message: "请选择是否外链" }]}>
							<Radio.Group optionType="button" buttonStyle="solid">
								<Radio value={1}>是</Radio>
								<Radio value={0}>否</Radio>
							</Radio.Group>
						</Form.Item>

						<Form.Item name="isShow" label="是否显示" rules={[{ required: true, message: "请选择是否显示" }]}>
							<Radio.Group optionType="button" buttonStyle="solid">
								<Radio value={1}>是</Radio>
								<Radio value={0}>否</Radio>
							</Radio.Group>
						</Form.Item>
					</>
				)}
				<Form.Item name="status" label="状态" rules={[{ required: true, message: "请选择状态" }]}>
					<Radio.Group optionType="button" buttonStyle="solid">
						<Radio value={1}>启用</Radio>
						<Radio value={0}>禁用</Radio>
					</Radio.Group>
				</Form.Item>
			</Form>
		</Modal>
	);
}
