/*基础类*/
function GameObj(x,y,spd,bitmapData,hp){
	base(this,LSprite,[]);
	var self = this;
	
	self.x = x;
	self.y = y;
	self.moveX=self.moveY=0;
	self.speed=spd;
	self.hp = hp;
	self.isdie=false;
	self.bitmap = new LBitmap(bitmapData);
	self.addChild(self.bitmap);
}

GameObj.prototype.onframe = function (){
	var self = this;
	//移动
	self.x += self.moveX*self.speed;
	self.y += self.moveY*self.speed;
	//self.callParent("onframe", arguments);
};
