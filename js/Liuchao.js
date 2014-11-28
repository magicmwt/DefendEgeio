/**
 * 刘超
 * 刘超擅长市场推广，所以在打击竞争对手上比较擅长
 */
function Liuchao(x, y, shootX, shootY, spd, bitmapData) {
    base(this, Player, [x, y, shootX, shootY, spd, bitmapData]);
    var self = this;
    self.belong = "liuchao";
    self.bulletBitmapData = new LBitmapData(imglist["bullet02"]);
}

Liuchao.prototype.onframe = function () {
	var self = this;
	self.callParent("onframe", arguments);
}