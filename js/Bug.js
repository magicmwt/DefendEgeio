/**
 * 敌机类
 * */
function Bug(x, y, spd, bitmapData, hp, damageX) {
    base(this, Enemy, [x, y, spd, bitmapData, hp, damageX]);
    var self = this;
    self.type = "bug";
	self.belong = "bug";
}

/**
 * 循环
 * */
Bug.prototype.onframe = function () {
    var self = this;
    self.callParent("onframe", arguments);

};

Bug.prototype.whenOut = function () {
    //Damage to Egeio
    var self = this;
    self.callParent("whenOut", arguments);
};