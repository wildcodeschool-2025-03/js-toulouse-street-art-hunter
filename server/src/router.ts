import express from "express";

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */

import artistActions from "./modules/artist/artistActions";
// Define item-related routes
import usersActions from "./modules/user/usersActions";

router.get("/api/user", usersActions.browse);
router.get("/api/user/:id", usersActions.read);
router.post("/api/user", usersActions.hashPassword, usersActions.add);

router.get("/api/artists", artistActions.browse);
router.get("/api/artists/:id", artistActions.read);
router.post("/api/artists", artistActions.add);

/* ************************************************************************* */

export default router;
