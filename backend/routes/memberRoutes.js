import { Router } from "express";
import { login } from "../controllers/memberController.js";

const router = Router();

router.post("/login", login);

export default router;
