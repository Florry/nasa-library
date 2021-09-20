import React, { FormEvent, useState } from "react";
import { SEARCH_MEDIA } from "../../constants/routes";
import { useStore } from "../../stores/StoreContext";
import LinkButton from "../shared/LinkButton";
import styles from "./Registration.module.css";

const Registration = () => {
	const [username, setUsername] = useState<string>();
	const [password, setPassword] = useState<string>();
	const [repeatPassword, setRepeatPassword] = useState<string>();
	const [showRepeatPasswordMessage, setShowRepeatPasswordMessage] = useState<boolean>();
	const [submitSucessful, setSubmitSucessful] = useState<boolean>();
	const [serverError, setServerError] = useState<string>(null);
	const { authStore } = useStore();

	const submit = async (e: FormEvent) => {
		e.preventDefault();

		if (password !== repeatPassword) {
			setShowRepeatPasswordMessage(true);
			return;
		} else {
			setShowRepeatPasswordMessage(false);
		}

		try {
			await authStore.register(username, password);
			setSubmitSucessful(true);
		} catch (err) {
			setServerError(err);
			setSubmitSucessful(false);
		}
	};

	return (
		<div className="registration">

			<h1>Register</h1>

			<div
				className={styles["registration__error-panel"]}
				hidden={serverError == null}>
				<p
					className={styles["registration__error-panel--error"]}>
					{serverError}
				</p>
			</div>

			<p
				hidden={submitSucessful}>
				Password has to be at least 5 characters long, no more than 100 characters long, contain at least one special character, one capital letter and one lower case character. Example Localhost:8080
			</p>

			<p
				hidden={!submitSucessful}>
				Account <span className={styles["registration__account-name"]}>{username}</span> successfully created! Go to <LinkButton href={SEARCH_MEDIA}>login</LinkButton> to login
			</p>

			<form
				hidden={submitSucessful}
				onSubmit={submit}>
				<div className="registration__form-group">
					<label
						htmlFor="username">
						Username:
					</label>

					<input
						value={username}
						type="text"
						placeholder="example"
						onChange={e => setUsername(e.target.value)}
					/>
				</div>

				<div className="registration__form-group">
					<label
						htmlFor="password">
						Password:
					</label>

					<input
						value={password}
						type="password"
						placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
						onChange={e => setPassword(e.target.value)}
					/>
				</div>
				<div className="registration__form-group">
					<label
						htmlFor="password">
						Repeat password:
					</label>

					<input
						value={repeatPassword}
						type="password"
						placeholder="&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;&#9679;"
						onChange={e => setRepeatPassword(e.target.value)}
					/>
				</div>
				<div
					className={styles["registration__error-panel"]}
					hidden={!showRepeatPasswordMessage}>
					<p
						className={styles["registration__error-panel--error"]}>
						The inputted passwords are not matching
					</p>
				</div>

				<button
					type="submit">
					Submit
				</button>

			</form>

		</div>
	);
};

export default Registration;
