import type { RequestHandler } from "express";
import discoveredRepository from "./discorveredRepository";

const repository = new discoveredRepository();

const browse: RequestHandler = async (req, res, next) => {
  try {
    const discovered = await repository.readAll();
    res.json(discovered);
  } catch (err) {
    next(err);
  }
};

const read: RequestHandler = async (req, res, next) => {
  try {
    const discoveredId = Number(req.params.id);
    const discovered = await repository.read(discoveredId);
    if (discoveredId == null) {
      res.sendStatus(404);
    } else {
      res.json(discovered);
    }
  } catch (err) {
    next(err);
  }
};

const add: RequestHandler = async (req, res, next) => {
  try {
    const newdiscovered = {
      user_Id: req.body.user_Id,
      artwork_Id: req.body.artwork_Id,
      discovered_at: req.body.discovered_at,
    };

    const insertId = await repository.create(newdiscovered);
    res.status(201).json({ insertId });
  } catch (err) {
    next(err);
  }
};

export default { browse, read, add };
