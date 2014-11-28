/**
 * 市场推广的enemy
 * */
function Rival(x, y, spd, bitmapData, hp, damage) {
    base(this, Enemy, [x, y, spd, bitmapData, hp, damage]);
	var self = this;
    self.type = "market";
	self.belong = "rival";
}

/**
 * 循环
 * */
Rival.prototype.onframe = function () {
    var self = this;
    self.callParent("onframe", arguments);

};

Rival.prototype.whenOut = function () {
    //Damage to Egeio
    var self = this;
    self.callParent("whenOut", arguments);
};