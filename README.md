# Silver-World Assistant


## Summary



## Introduction



## Feature List



## Installation

1. Install Chrome Extension [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo?hl=fr)
2. Install User Script [silver-world-assistant.user.js](https://github.com/neooblaster/Silver-World/raw/main/silver-world-assistant.user.js)


### Chrome Tampermonkey






## Development Section


### Identifiers



#### Map ID 

> ID is defined by the name of the JPEG filename.

| Map ID         | Name     | Portals     |
|----------------|----------|-------------|
| 6437a3b1a12b1  | Tutoria  | A-2         |



#### Objects List

> ID is defined by the name of the GIF filename.

| Gif ID | Item | Description |
|--------|------|-------------|
| obj4   | Petite potion de mana  | +30 mana point |
| obj32  | Potion moyenne de mana | +50 mana point |



#### Spells List

> ID is defined by the name of the GIF filename.

| Gif ID | Spell | Description |
|--------|-------|-------------|
| mag2   | Sort de soin moyen  | +60 hit point |



#### Monster ID

> ID is defined by the name of the GIF filename.

| Gif ID    | Monster |
|-----------|---------|
| monster1 | Blob |
| monster4 |  |
| monster5 | Abeille Tueuse |
| monster6 |  |
| monster7 | Scorpion |
| monster7 |  |
| monster16 | Pseudo-Dragon |






### Development Environment


#### TamperMonkey

- Settings for external cache
- Open chrome dev console and in ``network`` check `disable cache` to force resource reloading
- ``#!watch`` for **LESS** to check in real time modifications




#### Python

Run the following command line in the root of the project folder

> python -m http.server

Resources are available at ``http://localhost:8000/``.


#### Git