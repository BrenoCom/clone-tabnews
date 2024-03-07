import database from "../../../../infra/database.js";

export default async function status(req, res) {
  const result = await database.query('SELECT 1 as tas;')
  console.log(result.rows);
  res.status(200).json({ chave: "Sou acima da media" });
}
