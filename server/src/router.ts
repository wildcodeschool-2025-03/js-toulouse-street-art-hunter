import express from "express";

const router = express.Router();

import { upload } from "./middlewares/multer";
import artistActions from "./modules/artist/artistActions";
import artworkActions from "./modules/artwork/artworkActions";
import artworkRepositorty from "./modules/artwork/artworkRepositorty";
import discoveredActions from "./modules/discovered/discoveredActions";
import discoveredRouter from "./modules/discovered/discoveredRouter";
import itemActions from "./modules/item/itemActions";
import userActions from "./modules/user/usersActions";

router.post("/api/discovered", upload.single("photo"), discoveredActions.add);

router.use("/discovered", discoveredRouter);

router.get("/api/items", itemActions.browse);
router.get("/api/items/:id", itemActions.read);
router.post("/api/items", itemActions.add);

router.get("/api/users", userActions.browse);
router.get("/api/users/:id", userActions.read);
router.post(
  "/api/users/inscription",
  userActions.hashPassword,
  userActions.add,
);

import usersActions from "./modules/user/usersActions";

router.get("/api/user", usersActions.browse);
router.get("/api/user/:id", usersActions.read);
router.post("/api/user", usersActions.hashPassword, usersActions.add);

router.get("/api/artists", artistActions.browse);
router.get("/api/artists/:id", artistActions.read);
router.post("/api/artists", artistActions.add);

router.get("/api/artworks", artworkActions.browse);
router.get("/api/artworks/:id", artworkActions.read);
router.post("/api/artworks", artworkActions.add);

export default router;
