/**
 * 弹药类
 * */
function BulletCtrl(params) {
    base(this, LSprite, []);
    var self = this;
    //出现位置
    self.x = params.x;
    self.y = params.y;
    //xy轴速度
    self.xspeed = params.xspeed;
    self.yspeed = params.yspeed;
    self.bulletIndex = params.bulletIndex;
    self.bitmap = new LBitmap(params.bitmapData);
    //显示
    self.addChild(self.bitmap);
}

/**
 * 循环
 * */
BulletCtrl.prototype.onframe = function () {
    var self = this;
    //移动
    self.x += self.xspeed;
    self.y += self.yspeed;
    //位置检测
    if (self.x < 0 || self.x > gameWidth || self.y < mainPaddingTop || self.y > gameHeight + mainPaddingTop) {
        //从屏幕移除
        bulletCtrlLayer.removeChild(self);
    }

    var player_upgrade = document.getElementById("player_upgrade");
    var company_downgrade = document.getElementById("company_downgrade");

    if (LGlobal.hitTestArc(self, playerA)) {
        dealAHit(self.bulletIndex);
        self.parent.removeChild(self);
    }
    if (LGlobal.hitTestArc(self, playerB)) {
        dealBHit(self.bulletIndex);
        self.parent.removeChild(self);
    }
};

function dealAHit(bulletIndex) {
    switch (bulletIndex) {
        case 1:
            playerAtxt.text = "刘超被外星人附体，公司收益率下降一段时间";
            company_downgrade.play();
            company.increase_rate /= 0.9;
            companyIncreaseRateResetFrame = frames + 100;
            break;
        case 2:
            playerAtxt.text = "刘超远古血统觉醒，市场推广能力得到提升！";
            player_upgrade.play();
            playerA.setBullet(bulletIndex);
            playerABulletResetFrame = frames + 100;
            break;
        default :
            break;
    }
}

function dealBHit(bulletIndex) {
    switch (bulletIndex) {
        case 1:
            playerBtxt.text = "程远被外星人附体，公司收益率下降一段时间";
            company_downgrade.play();
            company.increase_rate /= 0.9;
            companyIncreaseRateResetFrame = frames + 100;
            break;
        case 2:
            playerBtxt.text = "程远获得了图灵的传承，解决bug能力提升！";
            player_upgrade.play();
            playerB.setBullet(bulletIndex);
            playerBBulletResetFrame = frames + 100;
            break;
        default :
            break;
    }
}