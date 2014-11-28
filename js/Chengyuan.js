/**
 * 程远
 * 擅长解决技术问题
 */
function Chengyuan(x, y, shootX, shootY, spd, bitmapData) {
    base(this, Player, [x, y, shootX, shootY, spd, bitmapData]);
    var self = this;
    self.belong = "Chengyuan";
    self.bulletBitmapData = new LBitmapData(imglist["bullet01"]);
}

Chengyuan.prototype.onframe = function () {
	var self = this;
	self.callParent("onframe", arguments);
}