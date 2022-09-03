// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import database from "../../../utils/firebase";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { method, body } = req;

    const db = await database.collection("users");

    switch (method) {
      case "GET":
        const login = (await db.get()).docs;

        res.json({ login });
        break;
      case "POST":
         const { id } = await db.add({
          ...body
         })

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
