import React from "react";
import { FAVORITES, REGISTER, SEARCH_MEDIA } from "../../../constants/routes";
import { useStore } from "../../../stores/StoreContext";
import Header from "../header/Header";
import LinkButton from "../LinkButton";
import styles from "./Navbar.module.css";

const Navbar = () => {
	const { authStore } = useStore();
	const { isLoggedIn } = authStore;

	const logout = async () => {
		await authStore.logout();
	};

	return (
		<div className={styles.navbar}>
			<div className={styles.navbar_content}>
				<Header />
				{
					isLoggedIn
						? <>
							<LinkButton href={SEARCH_MEDIA} >Search media</LinkButton>
							<LinkButton href={FAVORITES} >Favorites</LinkButton>
							<button onClick={logout}>Logout</button>
						</>
						: <>
							<LinkButton href={SEARCH_MEDIA} >Login</LinkButton>
							<LinkButton href={REGISTER} >Register</LinkButton>
						</>
				}
			</div>
		</div>
	);
};

export default Navbar;
