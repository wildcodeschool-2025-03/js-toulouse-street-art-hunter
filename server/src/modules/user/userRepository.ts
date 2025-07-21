import type { Result, Rows } from "../../../database/client";

import databaseClient from "../../../database/client";

type User = {
  id: number;
  pseudo: string;
  email: string;
  zip_code: string;
  last_name: string;
  first_name: string;
  password_hash: string;
  avatar_url: string;
};

class UserRepository {
  async create(user: Omit<User, "id">): Promise<Result> {
    const [result] = await databaseClient.query<Result>(
      "INSERT INTO user (pseudo, first_name, last_name, email, zip_code, password_hash, avatar_url ) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        user.pseudo,
        user.first_name,
        user.last_name,
        user.email,
        user.zip_code,
        user.password_hash,
        user.avatar_url,
      ],
    );
    return result;
  }

  async read(id: number) {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT* FROM user WHERE id = ?",
      [id],
    );

    return rows[0] as User;
  }

  async readAll() {
    const [rows] = await databaseClient.query<Rows>("SELECT * FROM user");
    return rows as User[];
  }

  async findByEmail(email: string): Promise<User | null> {
    const [rows] = await databaseClient.query<Rows>(
      "SELECT * FROM user WHERE email = ?",
      [email],
    );
    return rows.length > 0 ? (rows[0] as User) : null;
  }

  async update(user: User, id: number) {
    const [result] = await databaseClient.query<Result>(
      `UPDATE user SET
      pseudo = ?,
      first_name = ?,
      last_name = ?,
      password = ?, 
      profil_image_url = ?, 
      avatar_url = ?,
      zip_code = ?,
      WHERE id = ?`,
      [
        user.email ?? null,
        user.zip_code ?? null,
        user.last_name ?? null,
        user.first_name ?? null,
        user.password_hash ?? null,
        user.avatar_url ?? null,
        user.id ?? null,
      ],
    );
    return result;
  }

  async delete(id: number) {
    await databaseClient.query("DELETE FROM user WHERE id = ?", [id]);
  }
}

export default new UserRepository();
