import SQLite from 'react-native-sqlite-storage';

let db = SQLite.openDatabase({name: 'papers.db', createFromLocation: 1});

export const executeSQL = query => {
  let resultList = [];
  db.transaction(tx => {
    tx.executeSql(query, [], (tx, results) => {
      for (let i = 0; i < results.rows.length; ++i) {
        resultList.push(results.rows.item(i));
      }
    });
  });

  return resultList;
};

export const insertQuery = (tableName, row) => {
  let query =
    'INSERT INTO ' +
    tableName +
    ' (id, bin, pieces, product, bf, productDate, length, productWidth, quality, species, thickness, position, x, y) VALUES';
  query =
    query +
    "('" +
    row.id +
    "','" +
    row.bin +
    "','" +
    row.pieces +
    "','" +
    row.product +
    "','" +
    row.bf +
    "','" +
    row.date +
    "','" +
    row.length +
    "','" +
    row.width +
    "','" +
    row.quality +
    "','" +
    row.species +
    "','" +
    row.thickness +
    "','" +
    row.position +
    "','" +
    row.x +
    "','" +
    row.y +
    "')";

  return query;
};

export const groupByQuery = tableName => {
  let query = `SELECT product, thickness, count(product) FROM ${tableName} GROUP by product, thickness ORDER by product asc; `;
  return query;
};

export const createTableQuery = tableName => {
  let query = `CREATE TABLE IF NOT EXISTS ${tableName} (id nvarchar(100),bin nvarchar(100),pieces nvarchar(100), product nvarchar(100), bf nvarchar(100), productDate nvarchar(100), length nvarchar(100), productWidth nvarchar(100), quality nvarchar(100), species nvarchar(100), thickness nvarchar(100), position nvarchar(100), x nvarchar(100), y nvarchar(100));`;
  return query;
};

export const dropTableQuery = tableName => {
  let query = `DROP TABLE IF EXISTS ${tableName};`;
  return query;
};

export const listAllTables = () => {
  let query =
    "SELECT name FROM sqliteschema WHERE type='table' AND name NOT LIKE 'sqlite%'";
  return query;
};

export const partialSelectQuery = tableName => {
  let query = `SELECT id, position, x, y FROM ${tableName}`;
  return query;
};

export const selectQuery = tableName => {
  let query = `SELECT * FROM ${tableName}`;
  return query;
};
