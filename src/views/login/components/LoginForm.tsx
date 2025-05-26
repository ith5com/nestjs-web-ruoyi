import { useState } from "react";
import { Button, Form, Input, message, Popover } from "antd";
import { useNavigate } from "react-router-dom";
import { Login } from "@/api/interface";
import { loginApi } from "@/api/modules/login";
import { HOME_URL } from "@/config/config";
import { connect } from "react-redux";
import { setToken } from "@/redux/modules/global/action";
import { useTranslation } from "react-i18next";
import { setTabsList } from "@/redux/modules/tabs/action";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import wechatQR from "@/assets/images/wechat_qr.png";

const LoginForm = (props: any) => {
	const { t } = useTranslation();
	const { setToken, setTabsList } = props;
	const navigate = useNavigate();
	const [form] = Form.useForm();
	const [loading, setLoading] = useState<boolean>(false);

	// 登录
	const onFinish = async (loginForm: Login.ReqLoginForm) => {
		try {
			setLoading(true);
			const { data } = await loginApi(loginForm);
			setToken(data?.accessToken);
			setTabsList([]);
			message.success("登录成功！");
			navigate(HOME_URL);
		} finally {
			setLoading(false);
		}
	};

	const onFinishFailed = (errorInfo: any) => {
		console.log("Failed:", errorInfo);
	};

	const popoverContent = (
		<div style={{ textAlign: "center", width: 200 }}>
			<img src={wechatQR} alt="微信二维码" style={{ width: 160, marginBottom: 12 }} />
			<div style={{ color: "#666", fontSize: 14 }}>现在是公测阶段，请添加微信后，获得体验权限。</div>
		</div>
	);

	return (
		<Form
			form={form}
			name="basic"
			labelCol={{ span: 5 }}
			initialValues={{ username: "admin", password: "a123456" }}
			onFinish={onFinish}
			onFinishFailed={onFinishFailed}
			size="large"
			autoComplete="off"
			style={{ width: "350px" }}
		>
			<Form.Item name="username" rules={[{ required: true, message: "请输入用户名" }]}>
				<Input placeholder="用户名：admin / user" prefix={<UserOutlined />} />
			</Form.Item>
			<Form.Item name="password" rules={[{ required: true, message: "请输入密码" }]}>
				<Input.Password autoComplete="new-password" placeholder="密码：123456" prefix={<LockOutlined />} />
			</Form.Item>
			<Form.Item className="login-btn">
				{/* <Button
					onClick={() => {
						form.resetFields();
					}}
					icon={<CloseCircleOutlined />}
				>
					{t("login.reset")}
				</Button> */}
				<Button type="primary" block htmlType="submit" loading={loading}>
					{t("login.confirm")}
				</Button>
			</Form.Item>
			<div style={{ textAlign: "left", width: "100%", marginTop: -12 }}>
				<Popover content={popoverContent} trigger="click" placement="right">
					<a href="#" onClick={e => e.preventDefault()}>
						注册
					</a>
				</Popover>
			</div>
		</Form>
	);
};

const mapDispatchToProps = { setToken, setTabsList };
export default connect(null, mapDispatchToProps)(LoginForm);
