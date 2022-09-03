// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../utils/firebase";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		const { method, body } = req;

		const db = await database.firestore().collection("users");

		switch (method) {
			case "GET":
				const doc = await database
					.auth()
					.createUser({ email: body.email, password: body.password });
				//const doc = await db.doc().isEqual(body.email);

				if (!doc) {
					res.status(404).end();
				} else {
					const user = await db.add({
						email: doc.email,
						name: body.name,
					});

          res.status(200).json({
            user
          })
				}
				break;
			case "POST":
				const { id } = await db.add({
					...body,
				});

				res.status(200).json({ id });
				break;
			case "PUT":
				break;
			case "DELETE":
				break;
			default:
				break;
		}
	} catch (error) {
		return error;
	}
}
