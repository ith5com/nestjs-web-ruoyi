import { Modal, Form, Input, Select, Tree } from "antd";
import { useEffect, useState } from "react";
import { addRole } from "@/api/modules/system/role";
import { getPermissionOptionsApi } from "@/api/modules/system/permission";
import { System } from "@/api/interface/system";
import type { TreeProps } from "antd";

interface AddRoleModalProps {
	open: boolean;
	onCancel: () => void;
	onSuccess: () => void;
}

const AddRoleModal = ({ open, onCancel, onSuccess }: AddRoleModalProps) => {
	const [form] = Form.useForm();
	const [permissionData, setPermissionData] = useState<System.ResPermissionSelect["data"]>([]);
	const [loading, setLoading] = useState(false);
	const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

	// ✅ 自动补全父节点，用于提交后端
	function getAllParentKeys(treeData: any[], selectedKeys: string[]): string[] {
		const parentMap = new Map<string, string | null>();

		const buildMap = (nodes: any[], parent: string | null = null) => {
			nodes.forEach(node => {
				parentMap.set(node.key, parent);
				if (node.children) buildMap(node.children, node.key);
			});
		};

		buildMap(treeData);

		const result = new Set(selectedKeys);
		selectedKeys.forEach(key => {
			let parent = parentMap.get(key);
			while (parent) {
				result.add(parent);
				parent = parentMap.get(parent);
			}
		});

		return Array.from(result);
	}

	const handleOk = async () => {
		try {
			const values = await form.validateFields();
			const parentKeys = getAllParentKeys(permissionData, values.menus || []);
			setLoading(true);
			await addRole({
				...values,
				menus: parentKeys
			});
			onSuccess();
			form.resetFields();
		} catch (error) {
			console.error("新增角色失败:", error);
		} finally {
			setLoading(false);
		}
	};

	/**
	 * 获取权限树数据
	 */
	const getRoleSelect = async () => {
		const { data } = await getPermissionOptionsApi();
		if (data) {
			setPermissionData(data);
		}
	};

	const onCheck: TreeProps["onCheck"] = checked => {
		const keys = checked as string[];
		setCheckedKeys(keys);
		form.setFieldValue("menus", keys);
	};

	useEffect(() => {
		if (open) {
			getRoleSelect();
		}
	}, [open]);

	return (
		<Modal title="新增角色" visible={open} onOk={handleOk} onCancel={onCancel} confirmLoading={loading} destroyOnClose>
			<Form form={form} labelCol={{ span: 4 }} preserve={false}>
				<Form.Item name="name" label="角色名称" rules={[{ required: true, message: "请输入角色名称" }]}>
					<Input placeholder="请输入角色名称" />
				</Form.Item>
				<Form.Item name="code" label="角色编码" rules={[{ required: true, message: "请输入角色编码" }]}>
					<Input placeholder="请输入角色编码" />
				</Form.Item>
				<Form.Item name="remark" label="备注" rules={[{ required: true, message: "请输入备注" }]}>
					<Input.TextArea placeholder="请输入备注" />
				</Form.Item>
				<Form.Item name="status" label="状态" initialValue={1} rules={[{ required: true, message: "请选择状态" }]}>
					<Select
						options={[
							{ label: "启用", value: 1 },
							{ label: "禁用", value: 0 }
						]}
					/>
				</Form.Item>
				<Form.Item name="menus" label="权限">
					<div className="border border-gray-300 border-solid overflow-hidden h-[200px]">
						<Tree
							height={200}
							selectable={false}
							treeData={permissionData}
							defaultExpandAll
							checkable
							checkedKeys={checkedKeys}
							onCheck={onCheck}
						/>
					</div>
				</Form.Item>
			</Form>
		</Modal>
	);
};

export default AddRoleModal;
