import { Router } from "express";

import users from "./users";

const router = Router();

router.use("/users", users);

router.get("/", (req, res) => {
  res.send("ascii");
});

export default router;
