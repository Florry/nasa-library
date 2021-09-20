import Link from "next/link";

interface Props {
	href: string;
	children?: any;
}

const LinkButton = ({ href, children }: Props) => (
	// TODO: doesn't add href around children
	<Link
		href={href}
		passHref={true}
		as={href}
	>
		<button>
			{children}
		</button>
	</Link>
);

export default LinkButton;
