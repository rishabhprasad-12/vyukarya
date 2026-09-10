import { Router } from "express";
import { login, register, getUsers, getProfile } from "../controller/auth.controller";
import { protect } from "../middleware/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

// router.get("/users", getUsers);

router.get("/profile/:id", protect, getProfile);


export default router;
