/**
 * 玩家类
 * */
function Player(x, y, shootX, shootY, spd, bitmapData, belong) {
    base(this, GameObj, [x, y, spd, bitmapData, 1]);
    var self = this;
    self.shootX = shootX;
    self.shootY = shootY;
    self.shooting = false;
    if (belong == "liuchao") {
        self.bulletBitmapData = new LBitmapData(imglist["bullet01"]);
    }
    else {
        self.bulletBitmapData = new LBitmapData(imglist["bullet02"]);
    }

    self.belong = belong;
}

/**
 * 循环
 * */
Player.prototype.onframe = function () {
    var self = this;
    self.callParent("onframe", arguments);
    if (self.x < 0)
        self.x = 0;
    if (self.x > gameWidth - self.bitmap.width)
        self.x = gameWidth - self.bitmap.width;
    if (self.y < mainPaddingTop)
        self.y = mainPaddingTop;
    if (self.y > gameHeight + mainPaddingTop - self.bitmap.height)
        self.y = gameHeight + mainPaddingTop - self.bitmap.height;
    //射击
    if (self.shooting)self.shoot();

};

Player.prototype.shoot = function () {
    var self = this;
    if (company.money <= 0) {
        self.shooting = false;
        return;
    }
    var bullet = bulletList[self.bullet];
    if (self.shootIndex++ < bullet.step)return;
    self.shootIndex = 0;

    // 每次射击都会减少公司的资产
    company.useammo(shoot_cost);

    // 播放发射子弹的声音
    var bullet_sound = document.getElementById("bullet_sound");
    bullet_sound.play();

    //开始发射
    for (var i = 0; i < bullet.count; i++) {
        //发射角度
        var angle = i * bullet.angle + bullet.startAngle;
        //子弹xy轴速度
        xspeed = -bullet.speed * Math.cos(angle * Math.PI / 180);
        yspeed = bullet.speed * Math.sin(angle * Math.PI / 180);
        var params = {
            bitmapData: self.bulletBitmapData,
            x: self.x + self.shootX,
            y: self.y + self.shootY,
            xspeed: xspeed,
            yspeed: yspeed,
            belong: self.belong};
        //子弹实例化
        obj = new Bullet(params);
        //显示
        bulletLayer.addChild(obj);
    }
};


GameObj.prototype.setBullet = function (bulletIndex) {
    this.bullet = bulletIndex;
};
