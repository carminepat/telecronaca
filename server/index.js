//https://www.transfermarkt.it/italia_francia/index/spielbericht/53491

const sdk = require('node-appwrite');
const colors = require('colors');
const fs = require('fs');

const client = new sdk.Client();
const database = new sdk.Databases(client);
const databaseFileName=".database";

client.setEndpoint('http://localhost/v1') // Your API Endpoint
    .setProject('configurare-project-ID')   // Your project ID
    .setKey('configurare-API-key');  // Your secret API key

const args= process.argv.slice(2);
application(args);
function application(args){
    for (let iesimo = 0; iesimo < args.length; iesimo++) {
        const command = args[iesimo];
        if (command==='create') {
            createDatabase();
        }else if(command==='index'){
            let app=readApp();
            createIndexGiocatore(app);
            createIndexEvento(app);
        }else if(command==='insert'){
            let app=readApp();
            insertGiocatori(app);
        }else if(command==='delete'){
            let app=readApp();
            deleteDatabase(app.databaseID);
            fs.unlinkSync(databaseFileName);
        }else if(command==='get'){
            let app=readApp();
            getDocuments(app.databaseID,app.collectionID,args[iesimo+1]);
        }else if(command==='help'){
            console.log(`\n\n******************************
                HELP
    --> node index.js <COMMAND>\n
    COMMAND:
    create  --> 1 - create new application
    index   --> 2 - create index of attributes
    insert  --> 3 - create index and insert record in collection
    get     --> 4 - view record in collection giocatore
    delete  --> 5 - delete database and collection
******************************\n\n`.yellow);
        }
    }
}

function deleteDatabase(dataBaseID){
    const prmDeleteDB=database.delete(dataBaseID);

    prmDeleteDB.then(function(response){
        console.log(response);
    });
}

function createDatabase(){
    const prmDatabase = database.create('unique()', 'calcio');

    prmDatabase.then(function (response) {
        console.log(`Database ${response.name} created successfully (${response.$id})`.green);
        let databaseID=response.$id;
        createCollection(databaseID);
    }, function (error) {
        console.log(`Database NOT created! Errors: ${error}`.red);
    });
}

function writeApp(app){
    try {
        fs.writeFileSync(databaseFileName, JSON.stringify(app));
      } catch (err) {
        console.error(err.red);
      }
}

function readApp(){
    try {
        const data = fs.readFileSync(databaseFileName, 'utf8');
        return JSON.parse(data);
      } catch (err) {
        console.error(err.red);
      }
} 

function createCollection(dataBaseID){
    const prmGiocatore = database.createCollection(dataBaseID, 'unique()', 'giocatore', [sdk.Permission.read(sdk.Role.any())]);
    const prmEventi = database.createCollection(dataBaseID, 'unique()', 'eventi', [sdk.Permission.read(sdk.Role.any()),sdk.Permission.create(sdk.Role.any())]);
    
    prmGiocatore.then(function (response) {
        console.log(`Collection ${response.name} created successfully (${response.$id})`.green);
        let collectionID=response.$id;
        createAttributeCollectionGiocatore(dataBaseID,collectionID);
    }, function (error) {
        console.log(error);
    }); 

    prmEventi.then(function (response) {
        console.log(`Collection ${response.name} created successfully (${response.$id})`.green);
        createAttributeCollectionEventi(dataBaseID,response.$id);
    }, function (error) {
        console.log(error);
    }); 

    Promise.all([prmGiocatore,prmEventi]).then((values) => {
        let collectionIDGiocatore = values[0].$id;
        let collectionIDEvento = values[1].$id;
        writeApp(new Application(dataBaseID, collectionIDGiocatore, collectionIDEvento));
    })
    
}

function createAttributeCollectionGiocatore(dataBaseID,collectionID){
    const prmNumero = database.createIntegerAttribute(dataBaseID, collectionID, 'numero', true);
    const prmNome = database.createStringAttribute(dataBaseID, collectionID, 'nome',25, true);
    const prmRuolo = database.createStringAttribute(dataBaseID, collectionID, 'ruolo',25, true);
    const prmSquadra = database.createStringAttribute(dataBaseID, collectionID, 'squadra',20, true);
    const prmPosizione = database.createIntegerAttribute(dataBaseID, collectionID, 'posizione', true);
    
    prmNumero.then(function (response) {
        console.log(`Attribute ${response.key} created successfully`.green);
    }, function (error) {
        console.log(error);
    }); 

    prmNome.then(function (response) {
        console.log(`Attribute ${response.key} created successfully`.green);
    }, function (error) {
        console.log(error);
    }); 

    prmRuolo.then(function (response) {
        console.log(`Attribute ${response.key} created successfully`.green);
    }, function (error) {
        console.log(error);
    }); 

    prmSquadra.then(function (response) {
        console.log(`Attribute ${response.key} created successfully`.green);
    }, function (error) {
        console.log(error);
    }); 

    prmPosizione.then(function (response) {
        console.log(`Attribute ${response.key} created successfully`.green);
    }, function (error) {
        console.log(error);
    }); 
}

function createAttributeCollectionEventi(dataBaseID,collectionID){
    const prmGiocatore = database.createStringAttribute(dataBaseID, collectionID, 'giocatore',25, false);
    const prmAzione = database.createStringAttribute(dataBaseID, collectionID, 'azione',25, true);
    
    prmGiocatore.then(function (response) {
        console.log(`Attribute ${response.key} created successfully`.green);
    }, function (error) {
        console.log(error);
    }); 

    prmAzione.then(function (response) {
        console.log(`Attribute ${response.key} created successfully`.green);
    }, function (error) {
        console.log(error);
    });
}

function insertGiocatori(app){
    const squadra = [
                        {"numero":1,"nome":"Buffon","ruolo":"PORTIERE","squadra":"Italia","posizione":1},
                        {"numero":3,"nome":"Grosso","ruolo":"DIFENSORE","squadra":"Italia","posizione":2},
                        {"numero":23,"nome":"Materazzi","ruolo":"DIFENSORE","squadra":"Italia","posizione":3},
                        {"numero":5,"nome":"Cannavaro","ruolo":"CENTROCAMPISTA","squadra":"Italia","posizione":4},
                        {"numero":19,"nome":"Zambrotta","ruolo":"CENTROCAMPISTA","squadra":"Italia","posizione":5},
                        {"numero":8,"nome":"Gattuso","ruolo":"CENTRAVANTI","squadra":"Italia","posizione":6},
                        {"numero":21,"nome":"Pirlo","ruolo":"CENTRAVANTI","squadra":"Italia","posizione":7},
                        {"numero":20,"nome":"Perrotta","ruolo":"CENTRAVANTI","squadra":"Italia","posizione":8},
                        {"numero":16,"nome":"Camoranesi","ruolo":"ATTACCANTE","squadra":"Italia","posizione":9},
                        {"numero":9,"nome":"Toni","ruolo":"ATTACCANTE","squadra":"Italia","posizione":10},
                        {"numero":10,"nome":"Torri","ruolo":"ATTACCANTE","squadra":"Italia","posizione":11},

                        {"numero":16,"nome":"Barthez","ruolo":"PORTIERE","squadra":"Francia","posizione":1},
                        {"numero":3,"nome":"Abidal","ruolo":"DIFENSORE","squadra":"Francia","posizione":2},
                        {"numero":5,"nome":"Gallas","ruolo":"DIFENSORE","squadra":"Francia","posizione":3},
                        {"numero":15,"nome":"Thuram","ruolo":"ATTACCANTE","squadra":"Francia","posizione":4},
                        {"numero":19,"nome":"Sagnol","ruolo":"ATTACCANTE","squadra":"Francia","posizione":5},
                        {"numero":6,"nome":"Makélélé","ruolo":"ATTACCANTE","squadra":"Francia","posizione":6},
                        {"numero":4,"nome":"Vieira","ruolo":"ATTACCANTE","squadra":"Francia","posizione":7},
                        {"numero":7,"nome":"Malouda","ruolo":"ATTACCANTE","squadra":"Francia","posizione":8},
                        {"numero":10,"nome":"Zidane","ruolo":"ATTACCANTE","squadra":"Francia","posizione":9},
                        {"numero":22,"nome":"Ribéry","ruolo":"ATTACCANTE","squadra":"Francia","posizione":10},
                        {"numero":12,"nome":"Henry","ruolo":"ATTACCANTE","squadra":"Francia","posizione":11},

                    ];

    for (const giocatore of squadra) {
        const gIesimo = database.createDocument(app.databaseID, app.collectionIDGiocatore, 'unique()', giocatore);
        gIesimo.then(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        });
    }
}

function createIndexEvento(app){
    const prmSecondo = database.createIndex(app.databaseID, app.collectionIDEvento, 'createdAt', 'key', ['$createdAt'],['desc']);

    prmSecondo.then(function (response) {
        console.log(`Index ${response.key} created successfully`.green);
    }, function (error) {
        console.log(error);
    });
}

function createIndexGiocatore(app){
    const prmSquadra = database.createIndex(app.databaseID, app.collectionIDGiocatore, 'squadra', 'key', ['squadra'],['asc']);
    const prmPosizione = database.createIndex(app.databaseID, app.collectionIDGiocatore, 'posizione', 'key', ['posizione'],['asc']);

    prmSquadra.then(function (response) {
        console.log(`Index ${response.key} created successfully`.green);
    }, function (error) {
        console.log(error);
    });
    prmPosizione.then(function (response) {
        console.log(`Index ${response.key} created successfully`.green);
    }, function (error) {
        console.log(error);
    });
}

function getDocuments(dataBaseID,collectionID, squadra){
    let prmDocuments = database.listDocuments(
        dataBaseID,
        collectionID,
        [
            sdk.Query.equal('squadra', squadra),
            sdk.Query.orderAsc('posizione'),
            sdk.Query.limit(11)
        ]
    );

    prmDocuments.then(function (response) {
        console.log(response);
    }, function (error) {
        console.log(error);
    });
}

class Application{
    constructor(databaseID, collectionIDGiocatore, collectionIDEvento) {
        this.databaseID = databaseID;
        this.collectionIDGiocatore = collectionIDGiocatore;
        this.collectionIDEvento = collectionIDEvento;
      }
}