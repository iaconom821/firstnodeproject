const express = require("express");
const router = express.Router();
const { MongoClient } = require("mongodb");

async function main() {
  const uri =
    "mongodb+srv://mongouser:mongopassword@firstcluster.ze7cv.mongodb.net/FirstMongoDatabase?retryWrites=true&w=majority";

  const client = new MongoClient(uri);
  try {
   await client.connect();
   await updatePersonAgeByName(client, 'Mike', {age: 29})

  } catch (e) {
      console.error(e);
  } finally {
      await client.close();
  }
}

main().catch(console.error)

function upsertPerson()

async function updatePersonAgeByName(client, personName, updatedAge){
    const result = await client.db("FirstMongoDatabase").collection('people').updateOne({ name: personName}, {$set: updatedAge})

    console.log(result)
}

async function findPeopleWithMinimumAge(client, {minimumAge = 0, maximumNumberOfResults = Number.MAX_SAFE_INTEGER} = {}){

    const cursor = client.db("FirstMongoDatabase").collection('people').find( {
        age: { $gte: minimumAge }
    }).sort({ age: -1 }).limit(maximumNumberOfResults);

    const results = await cursor.toArray();

    if(results.length > 0) {
        console.log(`Found person(s) who are at least ${minimumAge}`)
        results.forEach( (result, i) => {
            console.log(`${i+1}. name: ${result.name}`)
            console.log(`age: ${result.age}`)
        })
    }

}

async function findOnePersonByName(client, nameOfPerson) {
    const result = await client.db("FirstMongoDatabase").collection("people").findOne({name: nameOfPerson});

    if(result) {
        console.log(`Found a person in the collection with the name of ${nameOfPerson}`)
        console.log(result)
    } else {
        console.log(`No listings found with ${nameOfPerson}`)
    }
}

async function createMultiplePeople(client, newPeople) {
    const result = await client.db("FirstMongoDatabase").collection("people").insertMany(newPeople);

    console.log(`${result.insertedCount} new listings created with the following ids: ${result.insertedIds}`)
}

async function createPerson(client, newPerson) {
    const result = await client.db("FirstMongoDatabase").collection("people").insertOne(newPerson);

    console.log(`New listing created with the following id: ${result.insertedId}`)
}

async function listDatabases(client){
    const databasesList = await client.db().admin().listDatabases();

    console.log(databasesList)
}


router.get("/", function (req, res, next) {
  res.send("API is working properly");
});

module.exports = router;
