# logview

# Traccia
## Visualizzatore di log di sistema
All'interno di un server web sono presenti i log di sistema. Sviluppare una applicazione che visualizzi in modo semanticamente ricco i log. L'applicazione dovrà inoltre fornire una API per accedere alla versione semanticamente arricchita del log includendo anche icone ed elementi grafici. Un esempio di grafica è proposto di seguito
http://portotheme.com/html/porto-admin/2.3.0/pages-log-viewer.html
Un possibile formato di rappresentazione dei log è il seguente http://www.processmining.org/logs/start
Per arricchire semanticamente il logo sono possibili varie strategie e sono apprezzate le proposte originali. Alcune idee che proponiamo sono le seguenti: consentire di rappresentare tutte le componenti implicite di un timestamp (giorno, mese, semestre, anno) consentendo in questo modo di filtrare più facilmente gli intervalli temporali.
Consentire l'aggregazione di più eventi di sistema in un unico evento di processo attraverso una organizzazione degli eventi di sistema in classi. 

## Note
- si possono utilizzare framework per la grafica, tipo bootsrap ecc
- Motivare riguardo alle tecnologie scelte (per esempio web socket ecc)
- analisi delle performance come scelte progettuali
- database non è un requisiti del progetto (può anche essere inserito)
- css è un requisito del progetto
- sessions/cookies -> express-sessions usa storage di default, meglio usare uno più avanzato e sicuro, anche se per il progetto va bene comunque; esistono delle buone pratiche per le sessioni
- authentication -> `express-basic-auth`
- application cache (pag. 225): con manifest possibile indicare quali risorse il browser deve salcare in cache https://www.quanzhanketang.com/html/html5_app_cache.html
- notifiche push


## Utils used for this project:
### Log generator:
Log examples generated with flog: https://github.com/mingrammer/flog
- flog -f apache_common
- flog -f apache_error
- flog -f apache_combined
### Regex resource:
- https://regex101.com/