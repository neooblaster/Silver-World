/**
 *
 */

/**
 * Bridging Resources
 */
// From // @require      https://rawcdn.githack.com/neooblaster/HTML/aa9263b08705a9676416f2ba64b474daa3a62945/release/v1.4.0/HTML.min.js
window.HTML = HTML;
// From // @require      https://cdn.jsdelivr.net/gh/neooblaster/jslib-deliver@master/Common/LocalStorageUtil/LocalStorageUtil.js
window.LocalStorageUtil = LocalStorageUtil;

// todo:
// document.querySelector('div.map_cell.position');
// -> data-position-x : 0-29 (1à30)
// -> data-position-y : 0-11 (AàL)


/**
 * feature <Feature> :
 *  ._oFeatures.<Feature>         --> Scope d'application sur PathName
 *  ._oDefaultSettings.<Feature>  --> Settings initial
 *  ._oSettings.<Feature>         --> Settings Life cycle
 *  .feature() return {<Feature>} --> Fonction
 *
 *
 *  -> Amémioration de ._oFeatures stockant les moteurs des features sous objet dont :
 *  {
 *      scopes: [x,x,x] --> Scope inutile si l'instance porte "runnable"
 *      instance: new function($oParent){
 *          ...
 *          avec
 *          init: function
 *          runnable: function
 *      }
 *  }
 *
 * .feature deviens l'interface de manipulation pour run et aussi fournir  la def initial
 *
 */

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

    self._nMonsterId = 0;
    self._aPreviousMonsters = {};

    self._sActiveMapName = null;
    self._aActiveMap = null;

    self.watcher = null;

    self._oFeatures = {
        structure: [/^\/map/],
        auto: {
            heal: [/^\/map/],
            mana: [/^\/map/]
        },
        watchMonsters: [/^\/map/]
    };

    /**
     * Default Setting for Initialization
     *
     * @type {{auto: {mana: boolean, heal: boolean}}}
     * @private
     */
    self._oDefaultSettings = {
        structure: true,
        auto: {
            heal: false,
            mana: false
        },
        watchMonsters: true
    };

    /**
     * Settings retrieve from LocalStorage
     *
     * @type {{}}
     * @private
     */
    self._oSettings = {

    };

    self._oHtmlElementsSelectors = {
        // Menu Bar
        menuController: "#MenuController",

        // Main Application Container
        mainContainer: "body > div.container",

        // Page Footer
        footer: "#footer",

        // Hit Point
        hitPoint: "img[v-tooltip='Vie']",

        // Mana Point
        manaPoint: "img[v-tooltip='Mana']",

        // Shortcut Bar
        shortcuts: "div.character-details .row.g-0",

        // Monster Container
        monsters: "#monsters_container"
    };

    self._oHtmlElements = {
        /**
         * Auto retrieved
         */
        // Structures
        menuController: null,
        mainContainer: null,
        footer: null,

        // Elements
        hitPoint:   null,
        manaPoint:  null,
        shortcuts:  null,
        monsters:   null,

        /**
         * Built Elements
         */
        monsterSpottedList: null,
    };

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

    self.ls = new LocalStorageUtil('SV-');

    /**
     * Returns the settings value using dot notation for better readability.
     * Returns null if object property is not found.
     *
     * @param $sSettingPath
     * @returns {*}
     */
    self.setting = function ($sSettingPath) {
        // getValueForPath from // @require      https://cdn.jsdelivr.net/gh/neooblaster/nativejs-proto-extensions/nativejs-proto-extensions.min.js
        return self._oSettings.getValueForPath($sSettingPath);
    };

    self.save = function () {
        return {
            settings: function () {
                self.ls.set('settings', JSON.stringify(self._oSettings));
            }
        }
    };

    // self.setting = function () {
    //     return {
    //         get: function ($sSettingPath) {
    //             // getValueForPath from // @require      https://cdn.jsdelivr.net/gh/neooblaster/nativejs-proto-extensions/nativejs-proto-extensions.min.js
    //             return self._oSettings.getValueForPath($sSettingPath);
    //         },
    //
    //         set: function($sSettingPath, $mValue) {
    //
    //         },
    //
    //         save: function () {
    //             self.ls.set('settings', JSON.stringify(self._oSettings));
    //         }
    //     }
    // };

    self.build = function(){

        // Create Spotted Monster List
        //oMonsterContainer.appendChild(oSpottedList = );

        return {
            monsterSpottedList: function () {
                let oMonsterSpottedList = {
                    children:[{name:'ul'}]
                };

                return self._oHtmlElements.monsterSpottedList = new HTML().compose(oMonsterSpottedList)
            }
        };
    };

    self.shortcut = function($sShortcutGifName, $fCondition){
        if($fCondition()){
            let oShortcutItem = self._oHtmlElements.shortcuts.querySelector(`img[src*="${$sShortcutGifName}"]`);
            if(oShortcutItem) {
                oShortcutItem.parentNode.click();
            }
        }
    };

    self.hp = function(){
        let oHP = self._oHtmlElements.hitPoint.parentNode.querySelector('span').textContent.split('/');

        return{
            current: function(){return parseInt(oHP[0].replace(' ', ''));},// !!! It's not a space char
            max: function(){return parseInt(oHP[1].replace(' ', ''));}// !!! It's not a space char
        };
    };

    self.mp = function(){
        let oMP = self._oHtmlElements.manaPoint.parentNode.querySelector('span').textContent.split('/');

        return{
            current: function(){return parseInt(oMP[0].replace(' ', ''));},// !!! It's not a space char
            max: function(){return parseInt(oMP[1].replace(' ', ''));}// !!! It's not a space char
        };
    };

    self.map = function ($sMapName = null) {
        let x = null;
        let y = null;

        let aMapNameToId = {
            "Tutoria": "6437a3b1a12b1"
        };

        let aMapIdToName = {
            "6437a3b1a12b1": "Tutoria"
        };

        // Check & Get for LocalStorage "Map"
        if (self.ls.get('maps') === null) {
            self.ls.set('maps', JSON.stringify({}));
        }
        let oMaps = JSON.parse(self.ls.get('maps'));

        // Get Map if specified
        if ($sMapName) {
            if (!oMaps[$sMapName]) {
                oMaps[$sMapName] = self.map().initialize();
            }
            self._sActiveMapName = $sMapName;
            self._aActiveMap = oMaps[$sMapName];
            self.map().save();
        }

        return {
            initialize: function () {
                let aMap = [];

                // Row (12)
                for (let r = 0; r < 12; r++) {
                    let aRow = [];
                    // Column (30)
                    for (let c = 0; c < 30; c++) {
                        aRow.push(-1);
                    }
                    aMap.push(aRow);
                }

                return aMap;
            },

            save: function () {
                // Sur BDD

                // LocalStorage
                let oMaps = JSON.parse(self.ls.get('maps'));
                oMaps[self._sActiveMapName] = self._aActiveMap;
                self.ls.set('maps', JSON.stringify(oMaps));
            },

            x: function () {//self._aActiveMap
                return {
                    y: self.map().y,
                    selectable: self.map().selectable,
                    unselectable: self.map().unselectable
                }
            },

            y: function () {//self._aActiveMap
                return {
                    x: self.map().x,
                    selectable: self.map().selectable,
                    unselectable: self.map().unselectable
                }
            },

            selectable: function () {//self._aActiveMap
                self.map().save();
            },

            unselectable: function () {//self._aActiveMap
                self.map().save();
            }
        };
    };

    self.feature = function ($sFeature) {
        return {
            runnable: function () {
                // getValueForPath from // @require https://cdn.jsdelivr.net/gh/neooblaster/nativejs-proto-extensions/nativejs-proto-extensions.min.js
                let aFeaturePathname = self._oFeatures.getValueForPath($sFeature);
                let bFeatureRunnable = false;

                if (aFeaturePathname) {
                    for(let i = 0; i < aFeaturePathname.length; i++){
                        if (aFeaturePathname[i].test(document.location.pathname)) {
                            bFeatureRunnable = true;
                            break;
                        }
                    }
                }

                return (bFeatureRunnable && self.setting($sFeature));
            },

            structure: function () {

            },

            auto: {
                heal: function () {

                },

                mana: function () {

                }
            }
        }
    };

    self.structureIdentifierEnhancer = function(){
        for (let sElement in self._oHtmlIdEnhancer) {
            let oEnhancement = self._oHtmlIdEnhancer[sElement];
            let oObject = self._oHtmlElements[sElement];

            if (oEnhancement.id) {
                oObject.setAttribute('id', oEnhancement.id)
            }
            if (oEnhancement.classes.length) {
                oEnhancement.classes.map(function ($sClass) {
                    oObject.classList.add(`SVA-${$sClass}`);
                });
            }

        }
    };

    self.init = function(){
        // Retrieve Elements
        for(let sKey in self._oHtmlElementsSelectors){
            let sValue = self._oHtmlElementsSelectors[sKey];
            self._oHtmlElements[sKey] = document.querySelector(sValue);
        }

        // Settings Initialization
        if (self.ls.get('settings') === null) {
            self._oSettings = self._oDefaultSettings;
            self.save().settings();
        }

        // Retrieve Settings
        self._oSettings = Object.assign(self._oDefaultSettings, JSON.parse(self.ls.get('settings')));

        // Enhance Elements
        if (self.feature('structure').runnable()) {
            self.structureIdentifierEnhancer();
        }

        // Start Features Watcher
        self.watcher = setInterval(self.watcher, 1000);

        return self;
    };

    // temporaire
    self.features = function () {
        return {

        }
    };

    self.watcher = function () {
        /**
         * Watch Monsters (+notifications)
         */
        if(self.feature('watchMonsters').runnable()){
            // Data initilization
            let oDate = new Date();
            let sDate = `${oDate.getHours()}h${oDate.getMinutes()}`;

            // Build Monster Spotted List container if not already done
            if (!self._oHtmlElements.monsterSpottedList) {
                self._oHtmlElements.monsters.appendChild(self.build().monsterSpottedList());
            }

            // @TODO L'identification doit s'effectuer sur le nom uniquement -> faire un attribut de stockage des noms, mais les notif sur apparition du nom à l'instant T
            // Retrieve all Monster cards
            let oMonsters = self._oHtmlElements.monsters.querySelectorAll('.monster');

            // Collect cards data
            let oCurrentMonsters = {};
            oMonsters.forEach(function ($oMonster) {
                // Data Collections
                let sMonsterName  = $oMonster.querySelector('span').textContent;
                let aMonsterGifID = $oMonster.querySelector('img').getAttribute('src').split('/');
                let sMonsterGifID  = aMonsterGifID[aMonsterGifID.length - 1].split('.')[0];

                // Data Generation
                let oMonsterData  = {
                    name: sMonsterName,
                    id: sMonsterGifID
                };

                // Append to current monster
                if (!oCurrentMonsters[sMonsterGifID]) {
                    oCurrentMonsters[sMonsterGifID] = oMonsterData
                }
            });

            // Check for new monsters
            for (let sMonsterGifId in oCurrentMonsters) {
                if(!oCurrentMonsters.hasOwnProperty(sMonsterGifId)) continue;
                if (!self._aPreviousMonsters[sMonsterGifId]) {
                    let sMonsterName = oCurrentMonsters[sMonsterGifId].name;
                    self._oHtmlElements.monsterSpottedList.querySelector('ul').appendChild(new HTML().compose({
                        name: "li", properties: {textContent: `${sMonsterName} (${sMonsterGifId}) spotted at ${sDate}.`}
                    }))
                }
            }

            // Save Previous Monster
            self._aPreviousMonsters = oCurrentMonsters;
        }

        /**
         *  Auto Heal ()
         */
        if(self.feature('auto.heal').runnable()){
            self.shortcut('mag2', function(){
                return ((self.hp().max() - self.hp().current()) >= 60);
            });
        }

        /**
         * Auto Mana ()
         */
        if(self.feature('auto.mana').runnable()){
            self.shortcut('obj4', function(){
                return ((self.mp().max() - self.mp().current()) >= 30);
            });

            self.shortcut('obj32', function(){
                return ((self.mp().max() - self.mp().current()) >= 50);
            });
        }
    };

    return self;
}

window.SV = new SilverWorldAssistant().init();