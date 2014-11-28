/**
 * 敌机类
 * */
function Enemy(x, y, spd, bitmapData, hp, damageX,belong) {
    base(this, GameObj, [x, y, spd, bitmapData, hp]);
    var self = this;
    self.belong = belong;
    self.damageX = damageX;
}

/**
 * 循环
 * */
Enemy.prototype.onframe = function () {
    var self = this;
    self.callParent("onframe", arguments);
    var isOut = false;
    if (self.x < 0 || self.x > gameWidth ||
        self.y < mainPaddingTop || self.y > gameHeight + mainPaddingTop) {
        isOut = true;
    }

    // 如果超出了游戏场景
    if (isOut) {
        self.whenOut();
    }

    // 如果该bug或者市场推广被击败
    if (self.hp <= 0) {
        if (self.belong == "bug") {
            var bomb_bug = document.getElementById("bomb_bug");
            bomb_bug.play();
        }
        else {
            var bomb_rival = document.getElementById("bomb_rival");
            bomb_rival.play();
        }

        company.potential += enemy_profit * self.damageX * company.increase_rate;
        plainLayer.removeChild(self);
    }

//    } else if (LGlobal.hitTestArc(self, player1)) {
//        //player.hp--;
//        if (player1.x < self.x) {
//            player1.x -= player1.getWidth();
//        } else {
//            player1.x += player1.getWidth();
//        }
//    }
//    else if (LGlobal.hitTestArc(self, player2)) {
//        //player2.hp--;
//        if (player2.x < self.x) {
//            player2.x -= player2.getWidth();
//        } else {
//            player2.x += player2.getWidth();
//        }
//    }
};

Enemy.prototype.whenOut = function () {
    var self = this;
    // Damage to Egeio
    // 每一个逃离的bug对公司的前景造成伤害
    company.damaged(enemy_lost_damage * self.damageX * 5);
    plainLayer.removeChild(self);
};