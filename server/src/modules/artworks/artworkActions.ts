import type { RequestHandler } from "express";

// Import access to data
import artworkRepository from "./artworkRepository";

// The B of BREAD - Browse (Read All) operation
const browse: RequestHandler = async (req, res, next) => {
  try {
    // Fetch all items
    const artwork = await artworkRepository.readAll();

    // Respond with the items in JSON format
    res.json(artwork);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read: RequestHandler = async (req, res, next) => {
  try {
    // Fetch a specific item based on the provided ID
    const itemId = Number(req.params.id);
    const artwork = await artworkRepository.read(itemId);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (artwork == null) {
      res.sendStatus(404);
    } else {
      res.json(artwork);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The A of BREAD - Add (Create) operation
// Define the type for new artwork
interface NewArtwork {
  title: string;
  artist_id: number;
  image_url: string;
  latitude: number;
  longitude: number;
  point: number;
  created_at: Date;
  updated_at: Date;
}

const add: RequestHandler = async (req, res, next) => {
  try {
    // Validate required fields
    const { title, artist_id, image_url, latitude, longitude, point } = req.body;

    const now = new Date();
    const newArtwork: NewArtwork = {
      title,
      artist_id,
      image_url,
      latitude,
      longitude,
      point,
      created_at: now,
      updated_at: now,
    };

    // Create the artwork
    const insertId = await artworkRepository.create(newArtwork);

    // Respond with HTTP 201 (Created) and the ID of the newly inserted item
    res.status(201).json({ insertId });
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

export default { browse, read, add };
