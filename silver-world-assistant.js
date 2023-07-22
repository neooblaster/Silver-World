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

function SilverWorldAssistant(){
    let self = this;

    self._nMonsterId = 0;

    self.watcher = null;

    self._oHtmlElementsSelectors = {
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
        // Auto retrieved
        hitPoint:   null,
        manaPoint:  null,
        shortcuts:  null,
        monsters:   null,

        // Built Elements
        spottedList: null,
    };

    self.ls = new LocalStorageUtil('SV-');

    self.build = function(){
        return {
        };
    };

    self.shortcut = function($sShortcutGifName, $fCondition){
        if($fCondition()){
            self._oHtmlElements.shortcuts.querySelector(`img[src*="${$sShortcutGifName}"]`).parentNode.click();
        }
    };

    self.hp = function(){
        let oHP = self._oHtmlElements.hitPoint.parentNode.querySelector('span').textContent.split('/');

        return{
            current: function(){return parseInt(oHP[0]);},
            max: function(){return parseInt(oHP[1]);}
        };
    };

    self.mp = function(){
        let oMP = self._oHtmlElements.manaPoint.parentNode.querySelector('span').textContent.split('/');

        return{
            current: function(){return parseInt(oMP[0]);},
            max: function(){return parseInt(oMP[1]);}
        };
    };

    self.init = function(){
        for(let sKey in self._oHtmlElementsSelectors){
            let sValue = self._oHtmlElementsSelectors[sKey];
            self._oHtmlElements[sKey] = document.querySelector(sValue);
        }

        // Initialization
        if(self.ls.get('watch-monsters') === null){self.ls.set('watch-monsters', true);}
        if(self.ls.get('auto-heal') === null){self.ls.set('auto-heal', true);}
        if(self.ls.get('auto-mana') === null){self.ls.set('auto-mana', true);}

        self.watcher = setInterval(function(){
            // Watch Monsters (+notifications)
            if(self.ls.get('watch-monsters') === "true"){
                // L'identification doit s'effectuer sur le nom uniquement -> faire un attribut de stockage des noms, mais les notif sur apparition du nom à l'instant T
                let oMonsters = self._oHtmlElements.monsters.querySelectorAll('.monster');

                oMonsters.forEach(function($oMonster){
                    if(!$oMonster.hasAttribute('data-spotted-id')){
                        console.log($oMonster, $oMonster.querySelector('span').textContent);
                        let oDate = new Date();
                        let sDate = `${oDate.getHours()}h${oDate.getMinutes()}`;
                        let sMonsterName = $oMonster.querySelector('span').textContent;
                        $oMonster.setAttribute('data-spotted-id', ++self._nMonsterId);
                        oSpottedList.querySelector('ul').appendChild(new HTML().compose({
                            name: "li", properties: {textContent: `${sMonsterName} [${self._nMonsterId}] spotted at ${sDate}.`}
                        }))
                    }
                });
            }

            // Auto Heal ()
            if(self.ls.get('auto-heal') === "true"){
                self.shortcut('mag2', function(){
                    return ((self.hp().max() - self.hp().current()) >= 60);
                });
            }

            // Auto Mana ()
            if(self.ls.get('auto-mana') === "true"){
                self.shortcut('obj4', function(){
                    return ((self.mp().max() - self.mp().current()) >= 30);
                });

                self.shortcut('obj32', function(){
                    return ((self.mp().max() - self.mp().current()) >= 50);
                });
            }
        }, 1000);

        return self;
    };

    return self;
}

window.SV = new SilverWorldAssistant().init();








// Identify Monster
// let nMonsterId = 0;
let oMonsterContainer = document.querySelector('#monsters_container');
let oSpottedList = null;

// Create Spotted Monster List
oMonsterContainer.appendChild(oSpottedList = new HTML().compose({
    children:[{name:'ul'}]
}));





// Watcher
// let nInterval = setInterval(function(){
// Watching Monster
//         let oMonsters = oMonsterContainer.querySelectorAll('.monster');

//         oMonsters.forEach(function(oEl){
//             if(!oEl.hasAttribute('data-spotted-id')){
//                 console.log(oEl, oEl.querySelector('span').textContent);
//                 let oDate = new Date();
//                 let sDate = `${oDate.getHours()}h${oDate.getMinutes()}`;
//                 let sMonsterName = oEl.querySelector('span').textContent;
//                 oEl.setAttribute('data-spotted-id', ++nMonsterId);
//                 oSpottedList.querySelector('ul').appendChild(new HTML().compose({
//                     name: "li", properties: {textContent: `${sMonsterName} [${nMonsterId}] spotted at ${sDate}.`}
//                 }))
//             }
//         });

// Auto-mana (petit potion / moins de 100)
// let nManaPoint = parseInt(document.querySelector("img[v-tooltip='Mana']").parentNode.querySelector('span').textContent.split('/')[0]);
// if(nManaPoint < 100){
//     // row g-0 = Barre raccourcis
//     // obj32 = Petit potion de mana
//     document.querySelector('.row.g-0 img[src*="obj32"]').parentNode.click();
// }

// Auto-heal
// }, 1000);