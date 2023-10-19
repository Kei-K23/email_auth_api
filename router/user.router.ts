import { Router } from "express";

export default function (router: Router) {
  router.get("/api/user", (req, res) => {
    return res.status(200).json({ test: " test" }).end();
  });
}
