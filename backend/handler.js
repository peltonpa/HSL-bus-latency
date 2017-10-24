const { Pool } = require("pg");

const pool = new Pool();

module.exports = { 
  newPool: () => {
    return new Pool();
  },
  query: (sql, params) => {
    pool.query(text, params); 
  }
}
