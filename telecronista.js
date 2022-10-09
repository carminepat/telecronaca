var appwrite = new window.Appwrite.Client();

// Init your Web SDK
appwrite
    .setEndpoint('http://localhost/v1') // Your API Endpoint
    .setProject('configurare-project-ID') // Your project ID
;

//create configuration with database id and collection id
var config = {
    "databaseId": "configurare-database-ID",
    "collectionGiocatoreID": "configurare-collection-giocatore-ID",
    "collectionAzioneID": "configurare-collection-azione-ID"
}

//init databases object from sdk
const databases = new Appwrite.Databases(appwrite);

function getSquadra(squadra, tbodyID){
    const promise = databases.listDocuments(config.databaseId, config.collectionGiocatoreID,
        [   // Filters
            Appwrite.Query.equal('squadra', squadra),
            Appwrite.Query.orderAsc('posizione'),
            Appwrite.Query.limit(11)
        ]);
    
    promise.then(function (response) {
        visualizzaSquadra(response.documents, tbodyID); // Success
    }, function (error) {
        console.log(error); // Failure
    });
}

function visualizzaSquadra(squadra, tbodyID){
    let tbody = document.getElementById(tbodyID);
    for (let i = 0; i < squadra.length; i++) {
        const giocatore = squadra[i];
        let riga = `<tr>
            <td>
            <img src="images/tshirt.png" height="30px" title=${giocatore.ruolo}><span class="number">${giocatore.numero}</span></td>
            <td>${giocatore.nome}</td>
            <td>
                <img class="focus" src="images/yellow-card.png" height="25px" title="cartellino giallo" onclick="sendAzione('cartellino-giallo','${giocatore.$id}')">
                <img class="focus" src="images/red-card.png" height="25px" title="cartellino rosso" onclick="sendAzione('cartellino-rosso','${giocatore.$id}')">
                <img class="focus" src="images/football.png" height="25px" title="tiro" onclick="sendAzione('tiro','${giocatore.$id}')">
                <img class="focus" src="images/soccer.png" height="25px" title="intercetta" onclick="sendAzione('intercetta','${giocatore.$id}')">
                <img class="focus" src="images/goal.png" height="25px" title="goal" onclick="sendAzione('goal','${giocatore.$id}')">                
            </td>
            </tr>`;
            tbody.innerHTML += riga;
    }
}

function sendAzione(azione, giocatore){
    let docToSend=null;
    if(giocatore){
        docToSend = {
            "azione": azione,
            "giocatore": giocatore
        }
    }else{
        docToSend = {
            "azione": azione
        }
    }
    const promise = databases.createDocument(config.databaseId, 
        config.collectionAzioneID, 'unique()', 
        docToSend);

    promise.then(function (response) {
        console.log(response); // Success
    }, function (error) {
        console.log(error); // Failure
    });
}

function aggiornaRealTime(){
    appwrite.subscribe(`databases.${config.databaseId}.collections.${config.collectionAzioneID}.documents`, response => {
        gestisciAzione(response.payload);
    });
}

function gestisciAzione(azione){
    console.log(azione.azione);
    if(azione.azione=='start'){
        viewStart();
    }else{
        gestisciAzioneConGiocatore(azione);
    }
}

function gestisciAzioneConGiocatore(azione){
    const promise = databases.getDocument(config.databaseId, config.collectionGiocatoreID, azione.giocatore);

    promise.then(function (response) {
        viewAzioneGiocatore(azione,response); // Success
    }, function (error) {
        console.log(error); // Failure
    });
}

function viewAzioneGiocatore(azione,giocatore){
let bandiera=giocatore.squadra=='Italia'?'images/italy.png':'images/france.png';
    let azioneView= `
    <div class="row">
    <div class="col-2">
        <img src="${bandiera}" height="40px" />
    </div>
    <div class="col-10">
        <img src="images/tshirt.png" height="30px" title=${giocatore.ruolo} />
        <span class="number spazio-maglietta">${giocatore.numero}</span>
        <span class="azione">${azione.azione} ${giocatore.nome}</span>
        <img src="${getImageAzione(azione.azione)}" class="float-end" height="30px"/>
    </div>
    </div>`;
    document.getElementById('eventi').innerHTML += azioneView;
    if(azione.azione=='goal'){
        aggiornaGoal(giocatore);
    }
}

function aggiornaGoal(giocatore){
    if(giocatore.squadra=='Italia'){
        let goalElement=document.getElementById('result-italy');
        let goal=parseInt(goalElement.dataset.rsItaly);
        goal++;
        goalElement.innerHTML=goal;
        goalElement.dataset.rsItaly=goal;
    }else{
        let goalElement=document.getElementById('result-france');
        let goal=parseInt(goalElement.dataset.rsFrance);
        goal++;
        goalElement.innerHTML=goal;
        goalElement.dataset.rsFrance=goal;
    }
}

function getImageAzione(azione){
    if(azione=='tiro'){
        return 'images/football.png';
    }else if(azione=='intercetta'){
        return 'images/soccer.png';
    }else if(azione=='goal'){
        return 'images/goal.png';
    }else if(azione=='cartellino-giallo'){
        return 'images/yellow-card.png';
    }else if(azione=='cartellino-rosso'){
        return 'images/red-card.png';
    }
}

function viewStart(){
    let start= `                
    <div class="row">
    <div class="col-2 d-flex">
        <img class="doppia-bandiera" src="images/italy.png" height="40px">
        <img src="images/france.png" height="40px">
    </div>
    <div class="col-10">
        <span class="azione">Inizia la partita Italia - Francia</span>
        <img src="images/start.png" class="float-end" height="30px" />
    </div>
    </div>`;
    document.getElementById('eventi').innerHTML += start;
}

