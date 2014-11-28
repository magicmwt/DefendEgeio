/**
 * 子弹类
 * */
function Bullet(params) {
    base(this, LSprite, []);
    var self = this;
    //出现位置
    self.x = params.x;
    self.y = params.y;
    //xy轴速度
    self.xspeed = params.xspeed;
    self.yspeed = params.yspeed;
    self.belong = params.belong;
    self.isdie = false;
    //子弹图片
    self.bitmap = new LBitmap(params.bitmapData);
    //显示
    self.addChild(self.bitmap);
}

/**
 * 循环
 * */
Bullet.prototype.onframe = function () {
    var self = this;
    if (self.isdie) {
        self.removeRun();
        return;
    }
    //子弹移动
    self.x += self.xspeed;
    self.y += self.yspeed;
    //子弹位置检测
    if (self.x < 0 || self.x > gameWidth || self.y < mainPaddingTop || self.y > gameHeight + mainPaddingTop) {
        //从屏幕移除
        bulletLayer.removeChild(self);
    }
    var key, enemy;

    // 当玩家的子弹碰到敌机时
	for (key in plainLayer.childList) {
		enemy = plainLayer.childList[key];

		if (playerA.objectindex != enemy.objectindex && playerB.objectindex != enemy.objectindex && LGlobal.hitTestArc(self, enemy)) {
			if (enemy.belong == "bug") {
				// 如果是刘超
				if (self.belong == playerA.belong) {
					enemy.hp -= 0.34;
				}
				else {
					enemy.hp--;
				}
			}
			else {
				// 如果是程远打
				if (self.belong == playerB.belong) {
					enemy.hp -= 0.34;
				}
				else {
					enemy.hp--;
				}
			}

			self.isdie = true;
			self.bitmap.bitmapData = new LBitmapData(imglist["remove"]);
			self.bitmap.x = -self.bitmap.getWidth() * 0.5;
			self.bitmap.y = -self.bitmap.getHeight() * 0.5;
		}
	}
    
};

Bullet.prototype.removeRun = function () {
    var self = this;
    if (self.alpha <= 0) {
        bulletLayer.removeChild(self);
        return;
    }
    self.bitmap.scaleX += 0.1;
    self.bitmap.scaleY += 0.1;
    self.bitmap.x = -self.bitmap.getWidth() * 0.5;
    self.bitmap.y = -self.bitmap.getHeight() * 0.5;
    self.alpha -= 0.1;
};