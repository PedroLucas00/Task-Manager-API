import type { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../../interfaces/user";
import database from "../../../utils/firebase";

export default async function userHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, body, query } = req;

    const db = database.firestore().collection("users");

    let doc;

    const id = query.id as any;

    switch (method) {
      case "GET":
        doc = await (await db.doc(id).get()).data();

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
        doc = await db.doc(id).update({
          ...body,
          updatedAt: Date.now(),
        });

        if (!doc) {
          res
            .status(404)
            .json({ statusCode: 404, message: "User data not found" });
        } else {
          res
            .status(200)
            .json({ statusCode: 200, message: "User data update succefully" });
        }

        break;
      case "DELETE":
        doc = await db.doc(id).delete();  
        
        await database.auth().deleteUser(body.uid);

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
        res.status(404).json({ statusCode: 404, message: "Invalid method" });
        break;
    }
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error });
  }
}
