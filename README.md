## Progetto di esempio presentato al Come to Code 2022
Applicazione web realizzata con SDK appwrite, per dimostrazione della funzionalità "realtime"

Requirements:
- 	 installazione Docker
- 	 installazione di NodeJs
- 	 installazione npm

Installazione appWrite (backend as a service):
```
    docker run -it --rm \
    --volume /var/run/docker.sock:/var/run/docker.sock \
    --volume "$(pwd)"/appwrite:/usr/src/code/appwrite:rw \
    --entrypoint="install" \
    appwrite/appwrite:1.0.2
```

Creazione del database, collection ed attributi:
- posizionarsi nella cartella 'server' 
- installare le dipendenze di nodeJs con: `npm install`
- configurare i parametri nel file index.js: *endpoint, projectID, secret API key*
- lanciare il comando: `node index.js help` per consultare le funzionalità a disposizione
- lanciare i comandi 1, 2, 3 con `node index.js create`

Per testare l'applicazione con le funzionalità di realtime (telecronista, tifoso) configurare all'interno dei file *telecronista.js e tifoso.js*: il projectID, e gli id del database e delle collection
 
```
├── css
│   └── custom.css
├── images
│   ├── images_for_web_application...
├── server
│   ├── index.js
│   ├── node_modules
│   │   ├── modules_installed_with_npm...
│   ├── package-lock.json
│   └── package.json
├── telecronista.html
├── telecronista.js
├── tifoso.html
└── tifoso.js
```

## Riferimenti:
[https://appwrite.io](url)

[https://30days.appwrite.io/](url)