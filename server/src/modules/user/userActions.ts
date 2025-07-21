import dotenv from "dotenv";
dotenv.config();

import argon2 from "argon2";
import type { NextFunction, Request, RequestHandler, Response } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import userRepository from "./userRepository";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET non défini dans le fichier .env");
}

// Type du payload JWT

type MyPayload = {
  id: string;
  email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

const authMiddleware: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = req.cookies.token || authHeader?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "Token manquant ou invalide" });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalide ou expiré" });
    return;
  }
};

// Connexion utilisateur

const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email et mot de passe requis." });
      return;
    }

    const user = await userRepository.findByEmail(email);

    if (!user) {
      res.status(401).json({ message: "Utilisateur non trouvé" });
      return;
    }

    const isValidPassword = await argon2.verify(user.password_hash, password);

    if (!isValidPassword) {
      res.status(401).json({ message: "Mot de passe incorrect." });
      return;
    }

    const myPayload: MyPayload = {
      id: user.id.toString(),
      email: user.email,
    };

    const token = jwt.sign(myPayload, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600000,
      })
      .status(200)
      .json({
        message: "Connexion réussie",
        userId: user.id,
        email: user.email,
      });
  } catch (err) {
    next(err);
  }
};

// Browse: récupérer tous les utilisateurs

const browse: RequestHandler = async (req, res, next) => {
  try {
    const users = await userRepository.readAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
// Read: récupérer un utilisateur par ID

const read: RequestHandler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);
    const user = await userRepository.read(userId);
    if (!user) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err: unknown) {
    next(err);
  }
};
// Add: ajouter un nouvel utilisateur

const add: RequestHandler = async (req, res, next) => {
  try {
    const {
      pseudo,
      first_name,
      last_name,
      email,
      password_hash,
      zip_code,
      avatar_url,
    } = req.body;

    const now = new Date();

    const newUser = {
      pseudo,
      last_name,
      first_name,
      email,
      password_hash,
      zip_code,
      avatar_url,
    };

    const { insertId } = await userRepository.create(newUser);
    res.status(201).json({ insertId });
    return;
  } catch (err: unknown) {
    next(err);
    return;
  }
};

const hashingOptions = {
  type: argon2.argon2id,
  memoryCost: 19 * 2 ** 10,
  timeCost: 2,
  parallelism: 1,
};

const hashPassword: RequestHandler = async (req, res, next) => {
  try {
    // Extraction du mot de passe de la requête

    const { password } = req.body;

    // Hachage du mot de passe avec les options spécifiées

    const hashedPassword = await argon2.hash(password, hashingOptions);

    // Remplacement du mot de passe non haché par le mot de passe haché dans la requête
    req.body.password_hash = hashedPassword;

    // Oubli du mot de passe non haché de la requête : il restera un secret même pour notre code dans les autres actions
    req.body.password = undefined;

    next();
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add, hashPassword, login, authMiddleware };
