import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { auth } from "../../firebase";
import { toast } from "react-toastify";
import { createOrUpdateUser } from "../../functions/auth";

const RegisterComplete = ({ history }) => {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	// const { user } = useSelector((state) => ({ ...state }));
	const dispatch = useDispatch();

	useEffect(() => {
		setEmail(window.localStorage.getItem("emailForRegistration"));
	}, [history]);

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!email || !password) {
			toast.error("Email and password is required");
			return;
		}
		if (password.length < 6) {
			toast.error("Password must be at least 6 characters long");
			return;
		}

		try {
			const result = await auth.signInWithEmailLink(
				email,
				window.location.href
			);
			if (result.user.emailVerified) {
				window.localStorage.removeItem("emailForRegistration");
				let user = auth.currentUser;
				await user.updatePassword(password);
				const idTokenResult = await user.getIdTokenResult();

				console.log("user", user, "idTokenResult", idTokenResult);
				createOrUpdateUser(idTokenResult.token)
					.then((res) => {
						console.log("CREATE OR UPDATE RESPONSE", res);
						dispatch({
							type: "LOGGED_IN_USER",
							payload: {
								name: res.data.name,
								email: res.data.email,
								token: idTokenResult.token,
								role: res.data.role,
								_id: res.data._id,
							},
						});
					})
					.catch((err) => console.log(err));

				history.push("/");
			}
			// console.log(result);
		} catch (error) {
			console.log(error);
			toast.error(error.message);
		}
	};

	const completeRegistrationForm = () => (
		<form onSubmit={handleSubmit}>
			<input type="email" className="form-control" value={email} disabled />

			<input
				type="password"
				className="form-control"
				value={password}
				placeholder="Password"
				onChange={(e) => {
					setPassword(e.target.value);
				}}
				autoFocus
			/>
			<br />
			<button type="submit" className="btn btn-raised">
				Complete Registration
			</button>
		</form>
	);

	return (
		<div className="container p-5">
			<div className="row">
				<div className="col-md-6 offset-md-3">
					<h4>Register Complete</h4>

					{completeRegistrationForm()}
				</div>
			</div>
		</div>
	);
};

export default RegisterComplete;
