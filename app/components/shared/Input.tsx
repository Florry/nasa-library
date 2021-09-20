import React from "react";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
	onChange: (value) => any;
}

const Input = ({ onChange, ...props }: Props) => {

	return (
		<input
			{...props}
			onChange={e => onChange(e.target.value)}
		/>
	);
};

export default Input;
