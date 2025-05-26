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
						<div className="login-left-title">优课引擎</div>
						<div className="login-left-desc">
							在向学生授课，或与教研团队协作时，优课引擎通过直播、录播、小册、作业与讨论等功能，将教学内容自然地串联起来。它帮助教师从学生视角出发，打造更清晰、更高效的学习路径，让每一次课堂都体现出教学的专注与用心。
						</div>
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
