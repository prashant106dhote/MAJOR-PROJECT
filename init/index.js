const mongoose  =  require("mongoose")
const initData = require("./data.js")

const listing = require("../models/listing.js");


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
main().then((res)=>{
    console.log("conected to DB");
    
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);

}

let initDB = async()=>{
   await listing.deleteMany({})
    initData.data= initData.data.map((obj)=>({... obj,owner:"68b5b6d278e0daab107cafc6"}))
   await listing.insertMany(initData.data);
   console.log("dat was saved");
   
}
initDB();