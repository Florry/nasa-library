import React, { useState } from 'react';
import { useStore } from '../../stores/StoreContext';
import styles from './Login.module.css';

const Login = () => {
	const { authStore } = useStore();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [serverError, setServerError] = useState(null);

	const login = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			await authStore.login(username, password);
		} catch (err) {
			setServerError(err);
		}
	};

	return (
		<div className={styles.login}>
			<h1>Login</h1>

			<form onSubmit={login}>
				<input
					className={styles.login__input}
					placeholder="username"
					type="text"
					value={username}
					onChange={e => setUsername(e.target.value)}
				/>

				<input
					className={styles.login__input}
					placeholder="password"
					type="password"
					value={password}
					onChange={e => setPassword(e.target.value)}
				/>

				<button
					type="submit">
					Login
				</button>

				{
					serverError !== null &&
					<div
						className={styles["login__error-panel"]}
					>
						<p
							className={styles["login__error-panel--error"]}>
							{typeof serverError === "object" ? JSON.stringify(serverError, undefined, 4) : serverError}
						</p>
					</div>
				}
			</form>
		</div>
	);
};

export default Login;
