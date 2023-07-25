/** ----------------------------------------------------------------------------
 *      Silver World Assistant - Core
 * -----------------------------------------------------------------------------
 *  Author  : Nicolas DUPRE
 *  Version : v0.1.0
 *  Release : 24.07.2023
 * -----------------------------------------------------------------------------
 *      Changelog
 * -----------------------------------------------------------------------------
 *
 *
 *
 *
 *
 * -----------------------------------------------------------------------------
 *      Work In Progress
 * -----------------------------------------------------------------------------
 *
 // document.querySelector('div.map_cell.position');
 // -> data-position-x : 0-29 (1à30)
 // -> data-position-y : 0-11 (AàL)
 * -----------------------------------------------------------------------------
 */


/** ----------------------------------------------------------------------------
 *      Bridging Resources between Tampermonkey & Web Browser page
 * -----------------------------------------------------------------------------
 */

/**
 * From https://rawcdn.githack.com/neooblaster/HTML/aa9263b08705a9676416f2ba64b474daa3a62945/release/v1.4.0/HTML.min.js
 */
window.HTML = HTML;

/**
 * From https://cdn.jsdelivr.net/gh/neooblaster/jslib-deliver@master/Common/LocalStorageUtil/LocalStorageUtil.js
 */
window.LocalStorageUtil = LocalStorageUtil;



/**
 *
 * @returns {SilverWorldAssistant}
 * @constructor
 *
 * Common :
 *  Update LocalStorage Settings : self.save().settings()
 *
 */
function SilverWorldAssistant(){
    let self = this;

    /**
     * The root location to load feature scripts (must be update on "prod" delivery)
     *
     * @type {string}
     * @private
     */
    // self._sRootLocation = 'http://localhost:8000/';
    self._sRootLocation = 'https://cdn.jsdelivr.net/gh/neooblaster/Silver-World@master/';

    /**
     * Default Setting for Initialization
     *
     * @type {{auto: {mana: boolean, heal: boolean}}}
     * @private
     */
    self._oDefaultSettings = {
        // Settings for Ui Restructuration
        structure: false,

        // Feature settings datastore
        features: {

        }
    };

    /**
     * Settings retrieve from LocalStorage
     *
     * @type {{}}
     * @private
     */
    self._oSettings = {

    };

    /**
     * HTML/CSS Query Selector to retrieve web page elements
     *
     * @type {{menuController: string, mainContainer: string, mainPlayerPanel: string, footer: string, shortcuts: string, monsters: string, hitPoint: string, manaPoint: string}}
     * @private
     */
    self._oHtmlElementsSelectors = {
        // Menu Bar
        menuController: "#MenuController",
        // Main Application Container
        mainContainer: "body > div.container",
        // Main Player Panel
        mainPlayerPanel: "#menu_full",
        // Player Image
        playerImage: "#menu_full img.avatar",
        // Player Name
        playerName: "#menu_full div.character-details div.label-name span:nth-child(1)",
        // Player Class - Level
        playerClassAndLevel: "#menu_full div.character-details div.label-name span:nth-child(2)",
        // Player Action point
        playerActionPoint: "#menu_full div.character-details div.label-name div.label-pa",
        // Player Golds
        playerGolds: "#menu_full div.character-details div.label-name div.label-gold",
        // Player Hit Point
        playerHitPoint: "#menu_full div.character-details div.label-gauge > div > div:nth-child(1) span span",
        // Player Mana Point
        playerManaPoint: "#menu_full div.character-details div.label-gauge > div > div:nth-child(2) span span",
        // Player Warrior Point
        playerSpecialPoint: "#menu_full div.character-details div.label-gauge > div > div:nth-child(3) span span",
        // Player Experience Point
        playerExperiencePoint: "#menu_full div.character-details div.label-gauge > div > div:nth-child(4) span span",
        // Shortcuts
        shortcuts: "#menu_full div.character-details .row.g-0",
        // Button Map
        buttonMap: "#menu_full div.character-details div.label-gauge div.row-buttons div:nth-child(1) a",
        // Button Char
        buttonChar: "#menu_full div.character-details div.label-gauge div.row-buttons div:nth-child(2) a",
        // Button Guild
        buttonGuild: "#menu_full div.character-details div.label-gauge div.row-buttons div:nth-child(3) a",
        // Button History
        buttonHistory: "#menu_full div.character-details div.label-gauge div.row-buttons div:nth-child(4) a",
        // Button Mail
        buttonMail: "#menu_full div.character-details div.label-gauge div.row-buttons div:nth-child(5) a",
        // Button Quests
        buttonQuests: "#menu_full div.character-details div.label-gauge div.row-buttons div:nth-child(6) a",



        // Page Footer
        footer: "#footer",
        // Monster Container
        monsters: "#monsters_container"
    };

    /**
     * Retrieved element stored localy
     *
     * @type {{menuController: null, mainContainer: null, footer: null, shortcuts: null, monsterSpottedList: null, monsters: null, hitPoint: null, manaPoint: null}}
     * @private
     */
    self._oHtmlElements = {
        /**
         * Auto retrieved
         */
        // Structures
        menuController: null,
        mainContainer: null,
        mainPlayerPanel: null,
        playerImage: null,
        playerName: null,
        playerClassAndLevel: null,
        playerActionPoint: null,
        playerGolds: null,
        playerHitPoint: null,
        playerManaPoint: null,
        playerSpecialPoint: null,
        playerExperiencePoint: null,
        shortcuts: null,
        buttonMap: null,
        buttonChar: null,
        buttonGuild: null,
        buttonHistory: null,
        buttonMail: null,
        buttonQuests: null,
        footer: null,

        // Elements
        monsters:   null,

        /**
         * Built Elements
         */
        monsterSpottedList: null,
    };

    /**
     * Registered feature (with their instance)
     *
     * @type {{}}
     */
    self.features = {

    };

    /**
     * Counter to acknolege when all feature are completely loaded
     *
     * @type {number}
     * @private
     */
    self._nLoadingFeatures = 0;




    /**<---------------------------------------------------------------------------------------**/
    /**<---------------------------------------------------------------------------------------**/
    /**<---------------------------------------------------------------------------------------**/
    self._nMonsterId = 0;
    self._aPreviousMonsters = {};
    self._sActiveMapName = null;
    self._aActiveMap = null;
    self.watcher = null;
    self._oHtmlIdEnhancer = {
        menuController: {
            id: "",
            classes: ["menuController"]
        },
        mainContainer: {
            id: "Main",
            classes: ["MainContainer"]
        },
        footer: {
            id: "",
            classes: ["footer"]
        },
    };
    /**<---------------------------------------------------------------------------------------**/
    /**<---------------------------------------------------------------------------------------**/
    /**<---------------------------------------------------------------------------------------**/







    /**
     * LocalStorageUtil
     *
     * @param $sPrefix
     * @return {{set: (function(String, mixed): boolean), get: (function(String): (DOMPoint | SVGNumber | string | SVGTransform | SVGLength | SVGPathSeg | any)), del: del}}
     */
    self.ls = new LocalStorageUtil('SV-');

    /**
     * Interface from main player panel
     *
     * @return {{getPlayerManaPoint: (function(): number), getActionPoint: (function(): number), getPlayerHitPoint: (function(): number), getPlayerMaxSpecialPoint: (function(): number), gotToMap: (function(): boolean), getPlayerName: (function(): string), getPlayerSpecialPoint: (function(): number), gotToChar: (function(): boolean), getPlayerGold: (function(): number), goToQuest: (function(): boolean), shortcut: (function(): {runShortcut: runShortcut, getGifIdByIndex: getGifIdByIndex, runByGifId: runByGifId, runByIndex: runByIndex}), getPlayerLevel: (function(): number), getPlayerImage: getPlayerImage, gotToGuild: (function(): boolean), getPlayerMaxManaPoint: (function(): number), goToHistory: (function(): boolean), getPlayerClass: (function(): string), getPlayerMaxHitPoint: (function(): number), getPlayerExperiencePoint: (function(): number), getPlayerNextLevelExperiencePoint: (function(): number), goToMail: (function(): boolean)}}
     */
    self.interface = function () {
        return {
            getPlayerImage: function () {

            },

            /**
             * Returns the player name.
             *
             * @return {string}
             */
            getPlayerName: function () {
                return self._oHtmlElements.playerName.textContent;
            },

            /***
             * Return the player class.
             *
             * @return {string}
             */
            getPlayerClass: function () {
                let sText = self._oHtmlElements.playerClassAndLevel.textContent.split('-');
                let sClass = sText[0].trim();
                return sClass.charAt(0).toUpperCase() + sClass.slice(1);
            },

            /**
             * Return the player level.
             *
             * @return {number}
             */
            getPlayerLevel: function () {
                let sText = self._oHtmlElements.playerClassAndLevel.textContent.split('-');
                return parseInt(sText[1].trim());
            },

            /***
             * Returns the amount of action point.
             *
             * @return {number}
             */
            getActionPoint: function () {
                return parseInt(self._oHtmlElements.playerActionPoint.textContent.match(/([0-9]+)/)[0]);
            },

            /***
             * Returns the amount of gold of the player.
             *
             * @return {number}
             */
            getPlayerGold: function () {
                return parseInt(self._oHtmlElements.playerGolds.textContent.match(/([0-9 ]+)/)[0].replace(/[ ]+/g, ''));// !!! It's not a space char
            },

            /**
             * Returns the current hit point value.
             *
             * @return {number}
             */
            getPlayerHitPoint: function () {
                return parseInt(self._oHtmlElements.playerHitPoint.textContent.split('/')[0].trim().replace(/[ ]+/g, ''));// !!! It's not a space char
            },

            /**
             * Returns the maximum hit point of the player.
             *
             * @return {number}
             */
            getPlayerMaxHitPoint: function () {
                return parseInt(self._oHtmlElements.playerHitPoint.textContent.split('/')[1].trim().replace(/[ ]+/g, ''));// !!! It's not a space char
            },

            /***
             * Returns the current mana point.
             *
             * @return {number}
             */
            getPlayerManaPoint: function () {
                return parseInt(self._oHtmlElements.playerManaPoint.textContent.split('/')[0].trim().replace(/[ ]+/g, ''));// !!! It's not a space char
            },

            /**
             * Returns the maximum mana point of the player.
             *
             * @return {number}
             */
            getPlayerMaxManaPoint: function () {
                return parseInt(self._oHtmlElements.playerManaPoint.textContent.split('/')[1].trim().replace(/[ ]+/g, ''));// !!! It's not a space char
            },

            /**
             * Returns the current point of the special attack.
             *
             * @return {number}
             */
            getPlayerSpecialPoint: function () {
                return parseInt(self._oHtmlElements.playerSpecialPoint.textContent.split('/')[0].trim().replace(/[ ]+/g, ''));// !!! It's not a space char
            },

            /**
             * Returns the maximum point of the special attack of the player.
             *
             * @return {number}
             */
            getPlayerMaxSpecialPoint: function () {
                return parseInt(self._oHtmlElements.playerSpecialPoint.textContent.split('/')[1].trim().replace(/[ ]+/g, ''));// !!! It's not a space char
            },

            /**
             * Returns the current experience point.
             *
             * @return {number}
             */
            getPlayerExperiencePoint: function () {
                return parseInt(self._oHtmlElements.playerExperiencePoint.textContent.split('/')[0].trim().replace(/[ ]+/g, ''));// !!! It's not a space char
            },

            /**
             * Returns the experience to reach to get a new level.
             *
             * @return {number}
             */
            getPlayerNextLevelExperiencePoint: function () {
                return parseInt(self._oHtmlElements.playerExperiencePoint.textContent.split('/')[1].trim().replace(/[ ]+/g, ''));// !!! It's not a space char
            },

            /**
             * Press (Simulate) on the Map button.
             *
             * @return {boolean}
             */
            gotToMap: function () {
                self._oHtmlElements.buttonMap.click();

                return true;
            },

            /**
             * Press (Simulate) on the player bag.
             *
             * @return {boolean}
             */
            gotToChar: function () {
                self._oHtmlElements.buttonChar.click();

                return true;
            },

            /**
             * Press (Simulate) on the shield & weapon button.
             *
             * @return {boolean}
             */
            gotToGuild: function () {
                self._oHtmlElements.buttonGuild.click();

                return true;
            },

            /**
             * Press (Simulate) on the scroll button.
             *
             * @return {boolean}
             */
            goToHistory: function () {
                self._oHtmlElements.buttonHistory.click();

                return true;
            },

            /**
             * Press (Simulate) on the letter button.
             *
             * @return {boolean}
             */
            goToMail: function () {
                self._oHtmlElements.buttonMail.click();

                return true;
            },

            /**
             * Press (Simulate) on the book button
             *
             * @return {boolean}
             */
            goToQuest: function () {
                self._oHtmlElements.buttonQuests.click();

                return true;
            },

            /**
             * Shortcut interface
             *
             * @return {{runShortcut: runShortcut, getGifIdByIndex: getGifIdByIndex, runByGifId: runByGifId, runByIndex: runByIndex}}
             */
            shortcut: function () {
                return {
                    /**
                     * Run shortcut from selector (from item image).
                     *
                     * @param $sSelector
                     */
                    runShortcut: function ($sSelector) {
                        let oShortcutItem = self._oHtmlElements.shortcuts.querySelector($sSelector);
                        if (oShortcutItem) {
                            oShortcutItem.parentNode.click();
                        }
                    },

                    /**
                     * Uses image GifId to run shortcut.
                     *
                     * @param $sGifId
                     */
                    runByGifId: function ($sGifId) {
                        self.interface().shortcut().runShortcut(`img[src*="${$sGifId}"]`);
                    },

                    /***
                     * Uses shortcut item position to run shortcut (from 0 to 2).
                     *
                     * @param $nIndex
                     */
                    runByIndex: function ($nIndex) {
                        self.interface().shortcut().runShortcut(`div:nth-child(${$nIndex + 1}) img`);
                    },

                    /**
                     * Returns the GifId of the image of the specified shortcut index ( from 0 to 2).
                     *
                     * @param $nIndex
                     * @return {string|null}
                     */
                    getGifIdByIndex: function ($nIndex) {
                        let oShortcutItem = self._oHtmlElements.shortcuts.querySelector(`div:nth-child(${$nIndex + 1})`);

                        if (oShortcutItem) {
                            let oShortcutItemImg = oShortcutItem.querySelector('img');
                            let aPathParts = oShortcutItemImg.getAttribute('src').split('/');
                            return aPathParts[aPathParts.length - 1].split('.')[0];
                        } else {
                            return null;
                        }
                    }
                }
            }
        }
    };

    /**
     * Settings Interface
     *
     * Return settings for Core, but also used as constructor as feature level
     * where settings scope is limited
     *
     * @param $sPathPrefix
     * @return {{set: set, get: get, save: save, initialize: initialize}}
     */
    self.setting = function ($sPathPrefix = '') {
        return {
            /**
             * Returns the settings value with property path by dot notation
             *
             * @param $sSettingPath
             * @return {null|*}
             */
            get: function ($sSettingPath) {
                // getValueForPath from // @require      https://cdn.jsdelivr.net/gh/neooblaster/nativejs-proto-extensions/nativejs-proto-extensions.min.js
                try {
                    return self._oSettings.getValueForPath(`${$sPathPrefix}${$sSettingPath}`);
                } catch ($err) {
                    return null;
                }
            },

            /**
             * Define the settings by dot notation
             *
             * @param $sSettingPath
             * @param $mValue
             * @return {boolean}
             */
            set: function($sSettingPath, $mValue) {
                let sSettingPath = `${$sPathPrefix}${$sSettingPath}`;
                let aProperties = sSettingPath.split('.');
                let oCurrentObject = self._oSettings;

                // Properties validation
                for (let nIndex = 0; nIndex < aProperties.length - 1; nIndex++) {
                    if (!oCurrentObject[aProperties[nIndex]]) {
                        oCurrentObject[aProperties[nIndex]] = {};

                        oCurrentObject = oCurrentObject[aProperties[nIndex]];
                    } else {
                        if (typeof oCurrentObject[aProperties[nIndex]] !== 'object') {
                            return false;
                        } else {
                            oCurrentObject = oCurrentObject[aProperties[nIndex]];
                        }
                    }
                }

                // If all succeeded
                let sProperty = aProperties[aProperties.length - 1];
                oCurrentObject[sProperty] = $mValue;

                self.setting().save();

                return true;
            },

            /**
             * Initialize settings with specified value only if settings does not exists
             *
             * @param $sSettingPath
             * @param $mValue
             */
            initialize: function ($sSettingPath, $mValue) {
                let sSettingPath = `${$sPathPrefix}${$sSettingPath}`;

                if (self.setting().get(sSettingPath) === null) {
                    self.setting().set(sSettingPath, $mValue);
                }

                self.setting().save();
            },

            /**
             * Store settings in the Local Storage
             */
            save: function () {
                self.ls.set('settings', JSON.stringify(self._oSettings));
            }
        }
    };

    /**
     * Feature interface
     *
     * @return {{runnable: (function(*=): boolean), interface: {init: interface.init}, register: register}}
     */
    self.feature = function () {
        return {
            /**
             * Default method impletation to prevent runtime errors
             */
            interface: {
                init: function () {

                },

                watching: function () {

                }

            },

            /**
             * Register a new feature (standing for a standalone JS Script)
             *
             * @param $sFeature
             */
            register: function ($sFeature) {
                // Indicates Feature is loading
                self._nLoadingFeatures++;
                console.log("Feature " + $sFeature + "is loading : " + self._nLoadingFeatures);

                let oNewScript = {
                    name: 'script',
                    attributes: {
                        src: `${self._sRootLocation}features/${$sFeature}.js`
                    },
                    properties: {
                        onload: function () {
                            // Let time to executes script
                            // setTimeout(function () {
                            // Feature script is loaded
                            self._nLoadingFeatures--;

                            // Instantiate
                            let fFunction = ()=>{};
                            eval(`fFunction = ${$sFeature}`);
                            self.features[$sFeature] = Object.assign(self.feature().interface, new fFunction(self));

                            // Initialize
                            self.features[$sFeature].init();

                            console.log("Feature " + $sFeature + "is loaded : " + self._nLoadingFeatures);
                            // }, 1000);

                        }
                    }
                };

                document.head.appendChild(new HTML().compose(oNewScript));
            },

            /**
             * Check if the Document.location.pathname match with specified scopes
             *
             * @param $aScope
             * @return {boolean}
             */
            runnable: function ($aScope) {
                let bFeatureRunnable = false;

                if ($aScope) {
                    for(let i = 0; i < $aScope.length; i++){
                        if ($aScope[i].test(document.location.pathname)) {
                            bFeatureRunnable = true;
                            break;
                        }
                    }
                }

                return bFeatureRunnable;
            }
        }
    };





    /**<---------------------------------------------------------------------------------------**/
    /**<---------------------------------------------------------------------------------------**/
    /**<---------------------------------------------------------------------------------------**/
    // self.build = function(){
    //     // Create Spotted Monster List
    //     //oMonsterContainer.appendChild(oSpottedList = );
    //
    //     return {
    //         monsterSpottedList: function () {
    //             let oMonsterSpottedList = {
    //                 children:[{name:'ul'}]
    //             };
    //
    //             return self._oHtmlElements.monsterSpottedList = new HTML().compose(oMonsterSpottedList)
    //         }
    //     };
    // };

    // self.map = function ($sMapName = null) {
    //     let x = null;
    //     let y = null;
    //
    //     let aMapNameToId = {
    //         "Tutoria": "6437a3b1a12b1"
    //     };
    //
    //     let aMapIdToName = {
    //         "6437a3b1a12b1": "Tutoria"
    //     };
    //
    //     // Check & Get for LocalStorage "Map"
    //     if (self.ls.get('maps') === null) {
    //         self.ls.set('maps', JSON.stringify({}));
    //     }
    //     let oMaps = JSON.parse(self.ls.get('maps'));
    //
    //     // Get Map if specified
    //     if ($sMapName) {
    //         if (!oMaps[$sMapName]) {
    //             oMaps[$sMapName] = self.map().initialize();
    //         }
    //         self._sActiveMapName = $sMapName;
    //         self._aActiveMap = oMaps[$sMapName];
    //         self.map().save();
    //     }
    //
    //     return {
    //         initialize: function () {
    //             let aMap = [];
    //
    //             // Row (12)
    //             for (let r = 0; r < 12; r++) {
    //                 let aRow = [];
    //                 // Column (30)
    //                 for (let c = 0; c < 30; c++) {
    //                     aRow.push(-1);
    //                 }
    //                 aMap.push(aRow);
    //             }
    //
    //             return aMap;
    //         },
    //
    //         save: function () {
    //             // Sur BDD
    //
    //             // LocalStorage
    //             let oMaps = JSON.parse(self.ls.get('maps'));
    //             oMaps[self._sActiveMapName] = self._aActiveMap;
    //             self.ls.set('maps', JSON.stringify(oMaps));
    //         },
    //
    //         x: function () {//self._aActiveMap
    //             return {
    //                 y: self.map().y,
    //                 selectable: self.map().selectable,
    //                 unselectable: self.map().unselectable
    //             }
    //         },
    //
    //         y: function () {//self._aActiveMap
    //             return {
    //                 x: self.map().x,
    //                 selectable: self.map().selectable,
    //                 unselectable: self.map().unselectable
    //             }
    //         },
    //
    //         selectable: function () {//self._aActiveMap
    //             self.map().save();
    //         },
    //
    //         unselectable: function () {//self._aActiveMap
    //             self.map().save();
    //         }
    //     };
    // };

    // self.structureIdentifierEnhancer = function(){
    //     for (let sElement in self._oHtmlIdEnhancer) {
    //         let oEnhancement = self._oHtmlIdEnhancer[sElement];
    //         let oObject = self._oHtmlElements[sElement];
    //
    //         if (oEnhancement.id) {
    //             oObject.setAttribute('id', oEnhancement.id)
    //         }
    //         if (oEnhancement.classes.length) {
    //             oEnhancement.classes.map(function ($sClass) {
    //                 oObject.classList.add(`SVA-${$sClass}`);
    //             });
    //         }
    //
    //     }
    // };

    /**
     *
     * @return {SilverWorldAssistant}
     */
    self.init = function(){
        // Retrieve Elements
        for(let sKey in self._oHtmlElementsSelectors){
            let sValue = self._oHtmlElementsSelectors[sKey];
            self._oHtmlElements[sKey] = document.querySelector(sValue);
        }

        // Settings Initialization
        if (self.ls.get('settings') === null) {
            self._oSettings = self._oDefaultSettings;
            self.setting().save();
        }

        // Retrieve Settings
        self._oSettings = Object.assign(self._oDefaultSettings, JSON.parse(self.ls.get('settings')));

        // Enhance Elements
        // if (self.feature('structure').runnable()) {
        //     self.structureIdentifierEnhancer();
        // }

        // Start Features Watcher
        self.watcher = setInterval(self.watcher, 500);

        return self;
    };

    /**
     * Performs actions in the game
     */
    self.watcher = function () {
        // Can not run if feature are loading
        if (!self._nLoadingFeatures) {
            // Core execution

            // Features execution
            for (let sFeature in self.features) {
                if(!self.features.hasOwnProperty(sFeature)) continue;
                self.features[sFeature].watching();
            }
        }
    };




    self.watcherOld = function () {
        // /**
        //  * Watch Monsters (+notifications)
        //  */
        // if(self.feature('watchMonsters').runnable()){
        //     // Data initilization
        //     let oDate = new Date();
        //     let sDate = `${oDate.getHours()}h${oDate.getMinutes()}`;
        //
        //     // Build Monster Spotted List container if not already done
        //     if (!self._oHtmlElements.monsterSpottedList) {
        //         self._oHtmlElements.monsters.appendChild(self.build().monsterSpottedList());
        //     }
        //
        //     // @TODO L'identification doit s'effectuer sur le nom uniquement -> faire un attribut de stockage des noms, mais les notif sur apparition du nom à l'instant T
        //     // Retrieve all Monster cards
        //     let oMonsters = self._oHtmlElements.monsters.querySelectorAll('.monster');
        //
        //     // Collect cards data
        //     let oCurrentMonsters = {};
        //     oMonsters.forEach(function ($oMonster) {
        //         // Data Collections
        //         let sMonsterName  = $oMonster.querySelector('span').textContent;
        //         let aMonsterGifID = $oMonster.querySelector('img').getAttribute('src').split('/');
        //         let sMonsterGifID  = aMonsterGifID[aMonsterGifID.length - 1].split('.')[0];
        //
        //         // Data Generation
        //         let oMonsterData  = {
        //             name: sMonsterName,
        //             id: sMonsterGifID
        //         };
        //
        //         // Append to current monster
        //         if (!oCurrentMonsters[sMonsterGifID]) {
        //             oCurrentMonsters[sMonsterGifID] = oMonsterData
        //         }
        //     });
        //
        //     // Check for new monsters
        //     for (let sMonsterGifId in oCurrentMonsters) {
        //         if(!oCurrentMonsters.hasOwnProperty(sMonsterGifId)) continue;
        //         if (!self._aPreviousMonsters[sMonsterGifId]) {
        //             let sMonsterName = oCurrentMonsters[sMonsterGifId].name;
        //             self._oHtmlElements.monsterSpottedList.querySelector('ul').appendChild(new HTML().compose({
        //                 name: "li", properties: {textContent: `${sMonsterName} (${sMonsterGifId}) spotted at ${sDate}.`}
        //             }))
        //         }
        //     }
        //
        //     // Save Previous Monster
        //     self._aPreviousMonsters = oCurrentMonsters;
        // }
        //
        // /**
        //  *  Auto Heal ()
        //  */
        // if(self.feature('auto.heal').runnable()){
        //     if ((self.interface().getPlayerMaxHitPoint() - self.interface().getPlayerHitPoint()) >= 100) {
        //         self.interface().shortcut().runByGifId('obj31');
        //     }
        //     if ((self.interface().getPlayerMaxHitPoint() - self.interface().getPlayerHitPoint()) >= 60) {
        //         self.interface().shortcut().runByGifId('mag2');
        //     }
        // }
    };
    /**<---------------------------------------------------------------------------------------**/
    /**<---------------------------------------------------------------------------------------**/
    /**<---------------------------------------------------------------------------------------**/


    return self;
}


// Instantiation
window.SV = new SilverWorldAssistant();

// Feature Registering
// window.SV.feature().register('autoHeal');
window.SV.feature().register('autoMana');
// window.SV.feature().register('autoAttack');

// Initialization & Run
window.SV.init();