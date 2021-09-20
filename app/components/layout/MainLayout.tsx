import { observer } from "mobx-react";
import React from "react";
import { useStore } from "../../stores/StoreContext";
import Login from "../login/Login";
import Navbar from "../shared/navbar/Navbar";
import styles from "./Layout.module.css";

interface Props {
	children: any;
	mustBeLoggedIn?: boolean;
}

const MainLayout = ({ children, mustBeLoggedIn = false }: Props) => {
	const { authStore } = useStore();
	const { isLoggedIn } = authStore;

	return (
		<div className={styles.page}>
			<Navbar />
			<div className={styles.content}>
				{
					!isLoggedIn && mustBeLoggedIn
						? <Login />
						: children
				}
			</div>
		</div>
	);
};

export default observer(MainLayout);
