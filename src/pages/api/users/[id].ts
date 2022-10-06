import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../interfaces/user";
import app from "../../../utils/firebase";
import adminApp from "../../../utils/firebase_admin";
import { getStorage, ref, uploadBytes } from "firebase/storage";

export default async function userHandler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { method, body, query, headers } = req;

		const database = adminApp.firestore().collection("users");
		const storage = getStorage(app);

		let doc;

		const id = query.id as any;

		const userImage = body.userImage as any;

		const token = headers.token as any;

		adminApp
			.auth()
			.verifyIdToken(token)
			.then(async () => {
				switch (method) {
					case "GET":
						doc = await (await database.doc(id).get()).data();

						if (!doc) {
							res
								.status(404)
								.json({ statusCode: 404, message: "User data not found" });
						} else {
							const user: User = {
								id: id,
								email: doc.email,
								name: doc.name,
							};

							res.status(200).json(user);
						}
						break;
					case "PUT":
						doc = await database.doc(id).update({
							...body,
							updatedAt: Date.now(),
						});

						if (!doc) {
							res
								.status(404)
								.json({ statusCode: 404, message: "User data not found" });
						} else {
							res.status(200).json({
								statusCode: 200,
								message: "User data update succefully",
							});
						}

						break;
					case "PATCH":
						const storageRef = ref(storage, `users/${id}`);

						uploadBytes(storageRef, userImage)
							.then(async (snapshot) => {
								// await database.doc(id).update({
								// 	userImage: snapshot.ref,
								// 	updatedAt: Date.now(),
								// });
                res.status(200).json({
                  message: snapshot.ref,
                });
							})
							.catch((error) => {
                res.status(404).json({
                  message: error.message,
                });
              });

						break;
					case "DELETE":
						doc = await database.doc(id).delete();

						await adminApp.auth().deleteUser(body.uid);

						if (!doc) {
							res
								.status(404)
								.json({ statusCode: 404, message: "Error to delete user" });
						} else {
							res
								.status(200)
								.json({ statusCode: 200, message: "User deleted succefully" });
						}

						break;
					default:
						res
							.status(404)
							.json({ statusCode: 404, message: "Invalid method" });
						break;
				}
			})
			.catch((error) => {
				res.status(404).json({
					statusCode: 404,
					message: "Invalid token",
					error: error.message,
				});
			});
	} catch (error) {
		res.status(500).json({ statusCode: 500, message: error });
	}
}
