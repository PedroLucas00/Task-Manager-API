// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { method } = req;

    switch (method) {
      case "GET":
        res.json({id: 1, name: "Jorge"})
        break;
      case "POST":
        break;
      case "PUT":
        break;
      case "DELETE":
        break;
      default:
        break;
    }
  } catch (error) {}
}
