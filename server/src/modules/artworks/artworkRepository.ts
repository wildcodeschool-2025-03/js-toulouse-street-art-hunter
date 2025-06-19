import databaseClient from "../../../database/client";

import type { Result, Rows } from "../../../database/client";

type Artwork = {
  id: number;
  title: string;
  image_url: string;
  latitude: number;
  longitude: number;
  artist_id: number;
  point: number;
  created_at: Date;
  updated_at: Date;
};

class artworkRepository {

  // The C of CRUD - Create operation

  async create(artwork: Omit<Artwork, "id">) {
    // Execute the SQL INSERT query to add a new item to the "item" table
    const [result] = await databaseClient.query<Result>(
      "insert into artwork (title, artist_id, latitude, longitude, point, created_at, updated_at, image_url) values (?, ?, ?, ?, ?, ?, ?, ?)",
      [artwork.title, artwork.artist_id, artwork.latitude, artwork.longitude, artwork.created_at, artwork.updated_at, artwork.point, artwork.image_url],
    );

    // Return the ID of the newly inserted item
    return result.insertId;
  }

  // The Rs of CRUD - Read operations

  async read(id: number) {
    // Execute the SQL SELECT query to retrieve a specific artwork by its ID
    const [rows] = await databaseClient.query<Rows>(
      "select * from artwork where id = ?",
      [id],
    );

    // Return the first row of the result, which represents the artwork
    return rows[0] as Artwork;
  }

  async readAll() {
    // Execute the SQL SELECT query to retrieve all artwork from the "item" table
    const [rows] = await databaseClient.query<Rows>("select * from artwork");

    // Return the array of items
    return rows as Artwork[];
  }

  // The U of CRUD - Update operation

  async update(id: number, artwork: Partial<Omit<Artwork, "id" | "created_at" | "update_at">>) {
    await databaseClient.query(
      `UPDATE ITEM SET title = ?, artist_id = ?, image_url = ?, latitude = ?, longitude = ?, point = ?, update_at =  NOW() WHERE id = ?`,
      [artwork.title, artwork.artist_id, artwork.image_url, artwork.latitude, artwork.longitude, artwork.point, id]
    );
  }
  // TODO: Implement the update operation to modify an existing item

  // async update(item: Item) {
  //   ...
  // }

  // The D of CRUD - Delete operation

  async delete(id: number) {
    await databaseClient.query("DELETE FROM artwork WHERE id = ?", [id]);
  }

  // TODO: Implement the delete operation to remove an item by its ID

  // async delete(id: number) {
  //   ...
  // }
}

export default new artworkRepository();