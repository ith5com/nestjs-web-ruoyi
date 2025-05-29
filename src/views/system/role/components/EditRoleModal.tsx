import { Modal, Form, Input, Select, Tree } from "antd";
import { useState, useEffect } from "react";
import { editRole } from "@/api/modules/system/role";
import type { System } from "@/api/interface/system";
import { getPermissionOptionsApi } from "@/api/modules/system/permission";
import type { TreeProps } from "antd";

interface EditRoleModalProps {
	open: boolean;
	onCancel: () => void;
	onSuccess: () => void;
	roleData?: System.RoleData;
}

const EditRoleModal = ({ open, onCancel, onSuccess, roleData }: EditRoleModalProps) => {
	const [form] = Form.useForm();
	const [loading, setLoading] = useState(false);
	const [permissionData, setPermissionData] = useState<System.ResPermissionSelect["data"]>([]);
	const [checkedKeys, setCheckedKeys] = useState<string[]>([]);

	function filterAutoCheckedParents(menus: string[], treeData: any[]): string[] {
		const menusSet = new Set(menus);
		const result = new Set<string>();

		const traverse = (node: any): boolean => {
			if (!node.children || node.children.length === 0) {
				// 是叶子节点，是否勾选
				if (menusSet.has(node.key)) result.add(node.key);
				return menusSet.has(node.key);
			}

			let childSelectedCount = 0;
			node.children.forEach(child => {
				if (traverse(child)) childSelectedCount++;
			});

			// 只有在所有子节点都选中时，才加上父节点
			const allChildrenSelected = childSelectedCount === node.children.length;
			if (allChildrenSelected && menusSet.has(node.key)) {
				result.add(node.key);
			}

			return allChildrenSelected && menusSet.has(node.key);
		};

		treeData.forEach(traverse);
		return Array.from(result);
	}

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
			const parentKeys = getAllParentKeys(permissionData, values.menus);
			console.log(parentKeys, "parentKeys");
			setLoading(true);
			await editRole(roleData?.id || "", {
				...values,
				menus: parentKeys
			});
			onSuccess();
			form.resetFields();
		} catch (error) {
			console.error("编辑角色失败:", error);
		} finally {
			setLoading(false);
		}
	};

	const getPermissionData = async () => {
		const { data } = await getPermissionOptionsApi();
		if (data) {
			setPermissionData(data);
		}
	};

	useEffect(() => {
		if (open) {
			getPermissionData();
		}
		if (open && roleData) {
			form.setFieldsValue({
				...roleData,
				menus: roleData.menus || []
			});
			setCheckedKeys(roleData.menus || []);
		}
	}, [open, roleData, form]);

	useEffect(() => {
		if (open && permissionData.length && roleData) {
			let newData = filterAutoCheckedParents(roleData.menus || [], permissionData);
			console.log(newData, "newData");
			setCheckedKeys(newData);
		}
	}, [open, permissionData, roleData]);

	const onCheck: TreeProps["onCheck"] = checked => {
		const keys = checked as string[];
		setCheckedKeys(keys);
		form.setFieldValue("menus", keys);
	};

	return (
		<Modal title="编辑角色" visible={open} onOk={handleOk} onCancel={onCancel} confirmLoading={loading} destroyOnClose>
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
				<Form.Item name="status" label="状态" rules={[{ required: true, message: "请选择状态" }]}>
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
							autoExpandParent
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

export default EditRoleModal;
