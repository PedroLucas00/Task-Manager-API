// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { UserRecord } from "firebase-admin/lib/auth/user-record";
import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../utils/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, body } = req;

    const db = await database.firestore().collection("users");

    let document: UserRecord;

    switch (method) {
      case "GET":
        document = await database.auth().getUserByEmail(body.email);

        if (!document) {
          res.status(404).json({ statusCode: 404, message: "User not found" });
        } else {
          await db
            .where("email", "==", body.email)
            .get()
            .then((data) => {
              if (!data.docs.length) {
                res
                  .status(404)
                  .json({ statusCode: 404, message: "User not found" });
              } else {
                data.forEach((doc) => {
                  res.status(200).json({ id: doc.id, uid: document.uid });
                });
              }
            });
        }

        break;
      case "POST":
        document = await database
          .auth()
          .createUser({ email: body.email, password: body.password });

        if (!document) {
          res.status(404).json({
            statusCode: 404,
            message: "Error to authenticate new user",
          });
        } else {
          const { id } = await db.add({
            email: document.email,
            name: body.name,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          });

          res.status(200).json({
            id: id,
            uid: document.uid,
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
