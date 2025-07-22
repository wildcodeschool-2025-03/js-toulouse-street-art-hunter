import type { Result, Rows } from "../../../database/client";

import databaseClient from "../../../database/client";

type discovered = {
  id: number;
  user_Id: number;
  artwork_Id: number;
  discovered_at: string;
};

class discoveredRepository {
  async create(discovered: Omit<discovered, "id">): Promise<Result> {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO discovered (user_Id, dicovered_Id, discovered_at) VALUES (?, ?, ?)",
      [discovered.user_Id, discovered.artwork_Id, discovered.discovered_at],
    );
    return result;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT* FROM discovered WHERE id = ?",
      [id],
    );

    return rows[0] as discovered;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("select * from discovered");
    return rows as discovered[];
  }

  async update(discovered: discovered) {
    const [result] = await databaseClient.query<Result>(
      "UPDATE discovered SET user_Id = ?, artwork_Id = ?, discovered_at = ?",
      [discovered.user_Id, discovered.artwork_Id, discovered.discovered_at],
    );
    return result;
  }

  async delete(id: number) {
    const [result] = await databaseClient.query<Result>(
      "DELETE FROM discovered WHERE id = ?",
      [id],
    );
    return result;
  }
}

export default discoveredRepository;
