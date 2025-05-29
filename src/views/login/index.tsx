import LoginForm from "./components/LoginForm";
// import SwitchDark from "@/components/SwitchDark";
import "./index.less";

const Login = () => {
	return (
		<div className="login-container">
			{/* <SwitchDark /> */}
			<div className="login-box">
				<div className="login-left-blue">
					<div className="login-left-content">
						<div className="login-left-title">优游网络</div>
						<div className="login-left-desc"></div>
					</div>
				</div>
				<div className="login-form">
					<div className="login-logo">
						<span className="logo-text">欢迎来到优课</span>
					</div>
					<LoginForm />
				</div>
			</div>
		</div>
	);
};

export default Login;
