import MainLayout from "../../components/layout/MainLayout";
import Registration from "../../components/registration/Registration";
import { UseMobx } from "../../middleware/UseMobx";

const RegisterPage = () => (
	<MainLayout>
		<Registration />
	</MainLayout>
);

export default RegisterPage;

export const getServerSideProps = UseMobx(() => { });
