import { Form, Input, message, Modal, Select, TreeSelect } from "antd";
import { useEffect, useState } from "react";
import { getDeptTreeApi } from "@/api/modules/system/dept";
import { addUserApi, editUserApi } from "@/api/modules/system/user";
import { getRoleSelectApi } from "@/api/modules/system/role";

interface AddUserProps {
	open: boolean;
	onCancel: () => void;
	onOk: (values: any) => void;
	title?: string;
	editData?: any;
}

const AddUser = ({ open, onCancel, onOk, title = "新增用户", editData }: AddUserProps) => {
	const [form] = Form.useForm();
	const [deptData, setDeptData] = useState<any>([]);
	const [roleOptions, setRoleOptions] = useState<any>([]);

	/**
	 * 获取部门树
	 */
	const getDeptTree = async () => {
		const { data } = await getDeptTreeApi();
		setDeptData(data);
	};

	/**
	 * 获取角色列表
	 */
	const getRoleList = async () => {
		const { data } = await getRoleSelectApi();
		setRoleOptions(data);
	};

	useEffect(() => {
		if (open) {
			getDeptTree();
			getRoleList();
			if (editData) {
				form.setFieldsValue({
					...editData,
					deptId: editData.dept?.id,
					roles: editData.roles?.map((item: any) => item.id) || []
				});
			}
		}
	}, [open, editData]);

	/**
	 * 提交表单
	 */
	const handleSubmit = async () => {
		try {
			const values = await form.validateFields();
			if (editData) {
				// 编辑模式
				await editUserApi(editData.id, {
					...values
				});
			} else {
				// 新增模式
				await addUserApi(values);
			}
			message.success(`${title}成功`);
			form.resetFields();
			onOk(values);
		} catch (error) {
			console.log("表单验证失败:", error);
		}
	};

	/**
	 * 取消
	 */
	const handleCancel = () => {
		form.resetFields();
		onCancel();
	};

	return (
		<Modal title={title} visible={open} onOk={handleSubmit} onCancel={handleCancel} width={600} destroyOnClose>
			<Form form={form} labelCol={{ span: 4 }} wrapperCol={{ span: 20 }} initialValues={{ status: 1 }}>
				<Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
					<Input placeholder="请输入用户名" />
				</Form.Item>
				<Form.Item
					label="手机号"
					name="phone"
					rules={[
						{ required: true, message: "请输入手机号" },
						{ pattern: /^1[3-9]\d{9}$/, message: "请输入正确的手机号" }
					]}
				>
					<Input placeholder="请输入手机号" />
				</Form.Item>
				{!editData && (
					<Form.Item label="密码" name="password" rules={[{ required: true, message: "请输入密码" }]}>
						<Input.Password placeholder="请输入密码" />
					</Form.Item>
				)}
				<Form.Item label="部门" name="deptId" rules={[{ required: true, message: "请选择部门" }]}>
					<TreeSelect
						treeData={deptData}
						fieldNames={{ label: "name", value: "id", children: "children" }}
						placeholder="请选择部门"
						treeDefaultExpandAll
						allowClear
					/>
				</Form.Item>
				<Form.Item label="角色" name="roles" rules={[{ required: true, message: "请选择角色" }]}>
					<Select mode="multiple" placeholder="请选择角色" options={roleOptions} allowClear />
				</Form.Item>
				<Form.Item label="状态" name="status" rules={[{ required: true, message: "请选择状态" }]}>
					<Select
						options={[
							{ label: "启用", value: 1 },
							{ label: "禁用", value: 0 }
						]}
					/>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddUser;
