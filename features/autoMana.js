function autoMana($oParent) {
    let self = this;
    self.parent = $oParent;

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
        let b = self.setting.get('enabled');
        return (self.runnable() && self.setting.get('enabled'));
    };

    /**
     *
     */
    self.init = function () {
        // Settings instanciation
        self.setting.initialize('enabled', false);
    };
}