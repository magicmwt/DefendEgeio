function Egeio(x, y, bitmapData, money, potential) {
    base(this, GameObj, [x, y, 0, bitmapData, 1]);
    var self = this;
    self.belong = "self";
    self.money = money; // 公司资产
    self.potential = potential; // 公司前景
    self.lastpotential = potential;
    self.lastfinance = money;
    self.company_status = "开始运营";
    self.increase_rate = 1;
}

/**
 * 融资
 */
Egeio.prototype.financing = function () {
    var self = this;
    var potential_change = self.potential - self.lastpotential;
	// 此次融资会增长公司前景增长的相应百分点
	self.money = (potential_change+10000*(frames/1000))*(1+frames/3000);
	self.lastpotential=self.potential;
//    if (self.money < 100) {
//        gameOver();
//    }
};

Egeio.prototype.onframe = function () {
    var self = this;
    self.callParent("onframe", arguments);

    var pcp = (self.potential - self.lastpotential)/self.lastpotential;
    if (pcp >= 0) {
        if (pcp <= 0.15) {
            self.company_status = "稳步发展";
        }
        else if (pcp > 0.15 && pcp <= 0.3) {
            self.company_status = "蒸蒸日上";
        }
        else {
            self.company_status = "迅猛发展";
        }
    }
    else {
        if (pcp > -0.1) {
            self.company_status = "出现亏损";
        }
        else if(pcp > -0.25 && pcp <= -0.1) {
            self.company_status = "亏损加重";
        }
        else {
            self.company_status = "即将倒闭";
        }
    }    self.status_level = 1;

    if (self.potential > company_max_potential) {
        gameClear();
    }
    if (self.potential <= company_min_potential) {
        gameOver();
    }
    if (self.money <= 100) {
        self.financing();
    }
};

Egeio.prototype.damaged = function (damage) {
    var self = this;
    self.potential -= damage;
};

Egeio.prototype.useammo = function (usage) {
    var self = this;
    self.money -= usage;
};