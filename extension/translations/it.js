// https://github.com/ChristopherKlay/StadiaEnhanced/discussions/7
const TRANSLATION_IT = {
    default: 'Predefinito',
    native: 'Nativo',
    hide: 'Nascondi',
    show: 'Mostra',
    total: 'Totale',
    visible: 'Visibile',
    hidden: 'Nascosto',
    enabled: 'Abilitato',
    disabled: 'Disabilitato',
    auto: 'Automatico',
    manual: 'Manuale',
    all: 'Tutti',
    locked: 'Bloccati',
    complete: 'Completati',
    incomplete: 'Incompleti',
    games: 'Giochi',
    allgames: 'Tutti i Giochi',
    leavepro: 'Ultimi giorni su Stadia Pro',
    bundles: 'Bundles',
    addons: 'Contenuti aggiuntivi',
    wishlist: 'Lista dei desideri',
    responsive: 'Reattivo',
    windowed: 'Modalità Finestra',
    fullscreen: 'Schermo Intero',
    onsale: 'In Offerta',
    prodeals: 'Offerte del Pro',
    userprofile: 'Profilo',
    usermedia: 'Screenshot & Video',
    searchbtnbase: 'Cerca su',
    avatarpopup: 'Nuovo URL avatar (vuoto per impostazione predefinita):',
    date: 'Data',
    time: 'Ore',
    sessiontime: 'Tempo sessione',
    codec: 'Codec',
    resolution: 'Risoluzione',
    hardware: 'Hardware',
    software: 'Software',
    trafficsession: 'Traffico sessione',
    trafficcurrent: 'Traffico corrente',
    trafficaverage: 'Traffico medio',
    packetloss: 'Pacchetti persi',
    framedrop: 'Fotogrammi persi',
    latency: 'Latenza',
    jitter: 'Buffer Jitter',
    decodetime: 'Tempo di Decodifica',
    compression: 'Compressione',
    bitrate: 'Bitrate',
    streammon: 'Monitor Stream',
    stream: 'Stream',
    network: 'Rete',
    session: 'Sessione',
    extdetail: 'Dettaglio Esteso',
    maxresolution: 'Risoluzione Massima',
    fps: 'Framerate',
    testdiscl: '<b>Nota bene:</b> Questo gioco deve ancora essere testato.',
    datadiscl: 'Questo è il framerate massimo ottenuto mentre si gioca in modalità 4k (devi essere un membro abbonato Pro).\
                            Tra i giochi dove è possibile selezionare la modalità risoluzione/framerate, è stata scelta la modalità risoluzione.  \
                            Questi dati sono forniti da  <a href="https://twitter.com/OriginaIPenguin" target="_blank">@OriginaIPenguin</a> \
                            e l\'intero database potete trovarlo <a href="https://linktr.ee/StadiaDatabase" target="_blank">qui</a>.',
    noteOne: 'Modalità 4K',
    noteTwo: 'Cambio 30/60 FPS',
    noteThree: '60 FPS in modalità 1080p',
    noteFour: '30 FPS in modalità 1080p',
    noteFive: 'Non compatibile con la modalità 4K',
    unsupported: 'Non supportato',
    crossfriends: 'Nessun sistema Amico Multipiattaforma',
    filtersettings: 'Impostazioni Filtro',
    saturation: 'Saturazione',
    contrast: 'Contrasto',
    brightness: 'Luminosità',
    sharpen: 'Affinare',
    community: 'Comunità',
    speedtest: 'Speedtest',
    quickaccess: 'Accesso Veloce',
    messages: 'Messaggi',
    comfeature: 'Features della Comunità',
    avatar: 'Avatar',
    interface: 'Interfaccia',
    shortcut: 'StadiaIcons',
    shortcuttitle: 'Installa una scorciatoia per',
    shortcutdesc: 'Ti permette di installare una scorciatoia per un gioco sul tuo dispositivo',
    stadiadatabase: 'Database Stadia ',
    stadiadatabasedesc: 'Visualizza una sezione "Dettagli estesi" nella pagina del negozio dei giochi, che mostra framerate, risoluzione e altro ancora sul gioco.',
    stadiahunters: 'Stadia Hunters',
    stadiahuntersdesc: 'Abilita la community Stadia Hunters, include il tracking degli obbiettivi, le guide, le classifiche e altro ancora. Il compagno perfetto per i cacciatori di obiettivi.',
    stadiahunterstitle: 'su Stadia Hunters',
    stadiahunterslogin: 'Clicca per accedere ',
    stadiahuntersnotfound: 'Utente non trovato',
    stadiahunterslevel: 'Livello',
    stadiahuntersworldrank: 'Classifica mondiale',
    stadiahuntersxphover: 'Progresso Livello',
    gridsize: 'Dimensione Griglia',
    griddesc: 'Modifica la quantità di giochi per riga nella libreria.',
    clock: 'Orologio',
    clockdesc: 'Visualizza l\'ora corrente nell\'elenco degli amici, come un overlay di gioco o entrambi.',
    friendslist: 'Lista Amici',
    igoverlay: 'Overlay In-Gioco',
    listoverlay: 'Lista & Overlay',
    filter: 'Filtro Giochi',
    filterdesc: 'Ti permette di ordinare la tua libreria, nascondendo i giochi. Il filtro può essere attivato/disattivato tramite il simbolo, in alto a destra sopra i tuoi giochi nella libreria.',
    invitebase: 'Copia link invito',
    inviteactive: 'Copiato!',
    gamelabel: 'Etichette Giochi',
    gamelabeldesc: 'Rimuove le etichette "Pro" dai giochi nella schermata home.',
    dimoverlay: 'Overlay Oscurato',
    dimoverlaydesc: 'Rimuove l\'effetto di oscuramento quando si apre il menu Stadia durante il gioco.',
    homegallery: 'Galleria Utente',
    homegallerydesc: 'Nasconde l\'area "Acquisizioni" nella parte inferiore della schermata home.',
    quickprev: 'Anteprima Messaggio',
    quickprevdesc: 'Nasconde l\'anteprima dei messaggi nella lista amici.',
    quickrep: 'Risposta Veloce',
    quickrepdesc: 'Nasconde l\'opzione di risposta rapida nelle chat.',
    offlinefriend: 'Amici Offline',
    offlinefrienddesc: 'Nasconde gli amici offline nella lista amici.',
    invisiblefriend: 'Amici Invisibili',
    invisiblefrienddesc: 'Nasconde gli amici con stato online sconosciuto nella lista amici.',
    notification: 'Notifiche',
    notificationdesc: 'Mostra una notifica quando Stadia Enhanced viene aggiornato ad una nuova versione ("Auto" si nasconde in automatico dopo 5 secondi, "Manuale" resta attivo fino all\'iterazione utente).',
    streammode: 'Modalità Streaming',
    streammodedesc: 'Abilita per rendere illeggibili alcuni elementi (ad esempio l\'elenco degli amici) durante lo streaming (tramite strumenti come OBS / Discord).',
    catprev: 'Anteprima Categoria',
    catprevdesc: 'Nasconde i tag di categoria quando si passa con il mouse su un gioco.',
    streammondesc: 'Attiva per avviare il monitor ogni volta che apri un gioco.',
    resolutiondesc: 'La risoluzione impostata per i giochi. 1440p e 2160p richiedono VP9.',
    codecdesc: 'Il codec utilizzato per i giochi.',
    confirmreset: 'Sei sicuro di voler ripristinare le impostazioni?',
    statistics: 'Statistiche',
    gamesfinished: 'Giochi Completati',
    achievementsunlocked: 'Obiettivi Sbloccati',
    totalPlayTime: 'Tempo di gioco totale',
    splitstore: 'Dividi Liste Store',
    splitstoredesc: 'Divide le liste nello store in due colonne per una migliore panoramica.',
    inlineimage: 'Anteprima Immagine',
    inlinedesc: 'Sostituisce i collegamenti alle immagini per i formati di file comuni (jpg / gif / png) con un\'anteprima cliccabile.',
    familyelements: 'Opzioni Gruppo-famiglia',
    familyelementsdesc: 'Nasconde l\'opzione "Condividi questo gioco con la famiglia".',
    donations: 'Donazioni',
    reportbug: 'Segnala un bug',
    exportset: 'Esporta impostazioni',
    importset: 'Importa impostazioni',
    importerror: 'Il file che si sta tentando di aprire non contiene un profilo Stadia Enhanced valido.',
    resetsettings: 'Ripristina Impostazioni'
}
