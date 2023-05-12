const express = require("express");
const cors = require("cors");
const app = express();

const getRows = (netcdf) => {
  return new Promise( (resolve,reject) => {
    db.serialize(() => {
      db.all( "SELECT variablekey,array FROM binary WHERE netcdf=?;",netcdf, (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      });
    });
  });
};

const sqlite3 = require('sqlite3').verbose();
let db = new sqlite3.Database('./data/2023010514.db', 
  sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
});

app.use(cors());
app.use(express.json());

app.get('/',(req,res) => {
  res.json("");
});

app.get('/sqlite', (req,res) => {
 
  let netcdf_filename = "OR-ABI-L2-CSRF-M6_v2r2_G18_s202301051400212_e202301051409520_c202301051413233.nc";
  let promise = getRows(netcdf_filename)
    .then((results) => {

      const out_results = {};
      const variable_keys = ["latitude","longitude","csr_bt_07"];

      for( const row of results ) {
        if (!variable_keys.includes(row.variablekey)){
          continue;
        }
        let arr_str = row.array.replace('[','');
        arr_str = arr_str.replace(']','');
        out_results[row.variablekey] = arr_str; 
      }
   
      // dump out the final result
      // *************************
      let json_ob = {
        "lat":out_results["latitude"],
        "lng":out_results["longitude"],
        "bt":out_results["csr_bt_07"]
      }
      res.json(json_ob);
    });

}); // end of request

app.listen(8000, () => {
  console.log("Server running on port 8000.");
});
