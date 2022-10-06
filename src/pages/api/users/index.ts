import type { NextApiRequest, NextApiResponse } from "next";
import app from "../../../utils/firebase";
import adminApp from "../../../utils/firebase_admin";
import {
	getAuth,
	signInWithEmailAndPassword,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
} from "firebase/auth";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { method, body, headers } = req;

		const auth = getAuth(app);

		const database = await adminApp.firestore().collection("users");

		const changePasswordCheck = headers.changepasswordcheck as any;

		switch (method) {
			case "GET":
				signInWithEmailAndPassword(auth, body.email, body.password)
					.then(async (userCredential) => {
						await database
							.where("email", "==", body.email)
							.get()
							.then((data) => {
								if (!data.docs.length) {
									res
										.status(404)
										.json({ statusCode: 404, message: "User not found" });
								} else {
									userCredential.user.getIdToken().then((idToken) => {
										data.forEach((doc) => {
											res.status(200).json({
												token: idToken,
												id: doc.id,
												uid: userCredential.user.uid,
											});
										});
									});
								}
							});
					})
					.catch(() => {
						res
							.status(404)
							.json({ statusCode: 404, message: "User not found" });
					});

				break;
			case "POST":
				if (changePasswordCheck == "true") {
					adminApp
						.auth()
						.generatePasswordResetLink(body.email)
						.then((link) => {
							sendPasswordResetEmail(auth, body.email, { url: link })
								.then(() => {
									res.status(200).json({
										message: "Link generated with succefully",
									});
								})
								.catch((error) => {
									res.status(404).json({
										message: error.message,
									});
								});
						})
						.catch((error) => {
							res.status(404).json({
								message: error.message,
							});
						});
				} else {
					createUserWithEmailAndPassword(auth, body.email, body.password)
						.then(async (userCredential) => {
							const { id } = await database.add({
								email: userCredential.user.email,
								name: body.name,
								createdAt: Date.now(),
								updatedAt: Date.now(),
							});
							adminApp
								.auth()
								.createCustomToken(userCredential.user.uid)
								.then((token) => {
									res.status(200).json({
										token: token,
										id: id,
										uid: userCredential.user.uid,
									});
								});
						})
						.catch(() => {
							res.status(404).json({
								statusCode: 404,
								message: "Error to authenticate new user",
							});
						});
				}

				break;

			default:
				res.status(404).json({ statusCode: 404, message: "Invalid method" });
				break;
		}
	} catch (error) {
		res.status(500).json({ statusCode: 500, message: error });
	}
}
