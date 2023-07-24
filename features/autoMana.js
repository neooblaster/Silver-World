function autoMana($oParent) {
    let self = this;
    self.parent = $oParent;

    /**
     * Object that provide mana point (came from DB)
     *
     * @type {*[]}
     * @private
     */
    self._aManaProvider = [
        // Petite Potion
        {item: "obj4",  regen: 30},
        // Grande Potion
        {item: "obj32", regen: 50},
    ];

    /**
     * Create at instance level, same method of parent but scope to features.autoMana.
     */
    self.setting = new self.parent.setting('features.autoMana.');

    /**
     * Simply runnable method with feature scope
     */
    self.runnable = self.parent.feature().runnable.bind(self, [/^\/map/]);

    /**
     * Indicates if the feature can run (in scope or settings enabled)
     *
     */
    self.canRun = function () {
        return (self.runnable() && self.setting.get('enabled'));
    };

    /**
     * Executed code by Core watcher (every seconds)
     */
    self.watching = function () {
        if (self.canRun()) {
            // Auto Mana from Lower to Higher item
            self._aManaProvider.map(function ($oItem) {
                if ((self.parent.interface().getPlayerMaxManaPoint() - self.parent.interface().getPlayerManaPoint()) >= $oItem.regen) {
                    self.parent.interface().shortcut().runByGifId($oItem.item);
                }
            });
        }
    };

    /**
     *
     */
    self.init = function () {
        // Settings instanciation
        self.setting.initialize('enabled', false);
    };
}