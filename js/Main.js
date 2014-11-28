/**
 * Main
 * */

/**
 * playerA : 刘超
 * playerB : 程远
 * @type {number}
 */
//设定游戏速度，屏幕大小，回调函数
var windowWidth = 1000;
var windowHeight = 800;
var mainPaddingTop = 150;
var gameWidth = 900;
var gameHeight = 500;

var textHeight = 100;
var playerTextWidth = 200;
var companyTextWidth = windowWidth - 2 * playerTextWidth;

var sideBuildingPaddingLeft = 100;
var sideBuildingWidth = 200;
var sideBuildingHeight = mainPaddingTop - textHeight;
var playerStatusWidth = 250;
var mainBuildingWidth = windowWidth - gameWidth;
var mainBuildingHeight = 200;

var shoot_cost = 100; // 一次子弹的发射需要$100

var enemy_lost_damage = 200; // 每遗漏一个enemy造成的损伤

var enemy_profit = 500; // 击败一个enemy的奖励

var company_init_money = 1000, company_init_potential = 10000;

var company_max_potential = 100000, company_min_potential = 8000;

init(20, "mylegend", windowWidth, windowHeight, main);

/**层变量*/
//显示进度条所用层
var loadingLayer;
//游戏层
var gameLayer, plainLayer, bulletLayer, bulletCtrlLayer, environmentLayer;
var textLayer, frameText, potentialText, cashText, statusText;

var gameInfoLayer;
var playerAInfoLayer, playerBInfoLayer, companyInfoLayer;

var playerAStatusLayer, playerBStatusLayer;
var playerAtxt, playerBtxt;

var playerABulletResetFrame, playerBBulletResetFrame; // 重新设置能力的帧数
var companyIncreaseRateResetFrame; // 公司增长率重新设置的帧数

var sideBuildingALayer, sideBuildingBLayer, mainBuildingLayer;
//图片path数组
var imgData = new Array(
    {name: "bullet01", path: "./images/bullet01.png"},
    {name: "bullet02", path: "./images/bullet02.png"},
    {name: "item1", path: "./images/item01.png"},
    {name: "item2", path: "./images/item02.png"},
    {name: "playerA", path: "./images/p2.png"},
    {name: "playerB", path: "./images/p1.png"},
    {name: "egeiologo", path: "./images/logo.jpg"},
    {name: "remove", path: "./images/remove.png"},
    {name: "enemy1", path: "./images/html.png"},
    {name: "enemy2", path: "./images/java.png"},
    {name: "enemy3", path: "./images/php.png"},
    {name: "enemy4", path: "./images/python.png"},
    {name: "gokuai", path: "./images/gokuai.png"},
    {name: "kingsoft", path: "./images/kingsoft.png"},
    {name: "kaipucloud", path: "./images/kaipucloud.png"},
    {name: "sohu", path: "./images/sohu.png"},
    {name: "youdao", path: "./images/youdao.png"},
    {name: "maike", path: "./images/maike.png"}
);
//读取完的图片数组
var imglist;
//子弹速度数组
var barrageSpeed = 10;

var playerA, playerB;
var company;
var frame = 0;
var frames = 0;
/**
 * 子弹类型数组
 * 【开始角度，增加角度，子弹速度，角度加速度，子弹总数，发动频率，枪口旋转】
 * */
var bulletList = new Array(
    {startAngle: 0, angle: 20, step: 10, speed: 5, count: 1},//1发
    {startAngle: -20, angle: 20, step: 10, speed: 5, count: 3},//3发
    {startAngle: -40, angle: 20, step: 10, speed: 5, count: 5},//5发
    {startAngle: 0, angle: 20, step: 10, speed: 5, count: 18},//环发
    {startAngle: 180, angle: 20, step: 50, speed: 5, count: 1},//1发
    {startAngle: 160, angle: 20, step: 50, speed: 5, count: 3},//3发
    {startAngle: 140, angle: 20, step: 50, speed: 5, count: 5}//5发
);

function main() {
    loadingLayer = new LoadingSample3();
    addChild(loadingLayer);
    LLoadManage.load(
        imgData,
        function (progress) {
            loadingLayer.setProgress(progress);
        },
        gameInit
    );
}

function gameInit(result) {
    // 开启bgm
    var bgm1 = document.getElementById("bgm1");
    bgm1.play();

    LGlobal.setDebug(true);
    imglist = result;
    removeChild(loadingLayer);
    loadingLayer = null;

    // 初始化游戏信息框
    gameInfoInit();

    // 初始化游戏界面
    gameViewInit();
}

function gameInfoInit() {
    gameInfoLayer = new LSprite();
    addChild(gameInfoLayer);

    playerAInfoLayer = new LSprite();
    playerBInfoLayer = new LSprite();
    companyInfoLayer = new LSprite();
    gameInfoLayer.addChild(playerAInfoLayer);
    gameInfoLayer.addChild(playerBInfoLayer);
    gameInfoLayer.addChild(companyInfoLayer);
    playerAInfoLayer.graphics.drawRect(0, "#000000", [0, 0, playerTextWidth, textHeight]);
    playerBInfoLayer.graphics.drawRect(0, "#000000", [playerTextWidth, 0, playerTextWidth, textHeight]);
    companyInfoLayer.graphics.drawRect(0, "#000000", [2 * playerTextWidth, 0, companyTextWidth, textHeight]);

    playerInfoTextInit(playerAInfoLayer, playerBInfoLayer);
    companyInfoTextInit(companyInfoLayer);
}

function playerInfoTextInit(playerAInfoLayer, playerBInfoLayer) {
    var playerAtxt = new LTextField();
    playerAtxt.text = "刘超";
    playerAtxt.size = 20;
    playerAtxt.x = 20;
    playerAtxt.y = 30;
    playerAInfoLayer.addChild(playerAtxt);

    var txt1 = new LTextField();
    txt1.text = "擅长攻击竞争对手";
    txt1.size = 15;
    txt1.x = 20;
    txt1.y = 60;
    playerAInfoLayer.addChild(txt1);

    var playerBtxt = new LTextField();
    playerBtxt.text = "程远";
    playerBtxt.size = 20;
    playerBtxt.x = playerTextWidth + 20;
    playerBtxt.y = 30;
    playerBInfoLayer.addChild(playerBtxt);

    var txt2 = new LTextField();
//    txt2.font = "幼圆";
    txt2.text = "擅长解决bug";
    txt2.size = 15;
    txt2.x = playerTextWidth + 20;
    txt2.y = 60;
    playerBInfoLayer.addChild(txt2);
}

function companyInfoTextInit(companyInfoLayer) {
    var txt1 = new LTextField();
    txt1.text = "你击败的的竞争对手越多，或者解决的bug越多，你公司上市的机会就越大！！";
    txt1.size = 10;
    txt1.x = 2 * playerTextWidth + 10;
    txt1.y = 20;
    companyInfoLayer.addChild(txt1);

    var txt2 = new LTextField();
    txt2.text = "反之你放过的竞争对手或者bug越多，你公司的估值就越低，你的公司就越容易倒闭！！";
    txt2.size = 10;
    txt2.x = 2 * playerTextWidth + 10;
    txt2.y = 35;
    companyInfoLayer.addChild(txt2);

    var companyInfoTxt = new LTextField();
    companyInfoTxt.text = "每一次射击都会消耗你当前的金钱，当资金耗尽时将会自动触发融资，好好赚钱，Good Luck~";
    companyInfoTxt.size = 10;
    companyInfoTxt.x = 2 * playerTextWidth + 10;
    companyInfoTxt.y = 50;
    companyInfoLayer.addChild(companyInfoTxt);

    cashText = new LTextField();
    cashText.size = 10;
    cashText.x = 2 * playerTextWidth + 10;
    cashText.y = 70;
    companyInfoLayer.addChild(cashText);

    potentialText = new LTextField();
    potentialText.size = 10;
    potentialText.x = 2 * playerTextWidth + 160;
    potentialText.y = 70;
    companyInfoLayer.addChild(potentialText);

    statusText = new LTextField();
    statusText.size = 10;
    statusText.x = 2 * playerTextWidth + 290;
    statusText.y = 70;
    companyInfoLayer.addChild(statusText);
}

/**
 * 游戏场景初始化
 */
function gameViewInit() {
    // 外婆家
    sideBuildingALayer = new LSprite();
    addChild(sideBuildingALayer);
    sideBuildingALayer.graphics.drawRect(1, "#000000", [sideBuildingPaddingLeft, textHeight, sideBuildingWidth, sideBuildingHeight]);
    var sideBuildingAText = new LTextField();
    sideBuildingAText.text = "外婆家";
    sideBuildingAText.size = 20;
    sideBuildingAText.x = sideBuildingPaddingLeft + 20;
    sideBuildingAText.y = textHeight + 15;
    sideBuildingALayer.addChild(sideBuildingAText);

    // A玩家的状态
    playerAStatusLayer = new LSprite();
    addChild(playerAStatusLayer);
    sideBuildingALayer.graphics.drawRect(0, "#000000", [sideBuildingPaddingLeft + sideBuildingWidth, textHeight, playerStatusWidth, sideBuildingHeight]);
    playerAtxt = new LTextField();
    playerAtxt.size = 10;
    playerAtxt.x = sideBuildingPaddingLeft + sideBuildingWidth + 20;
    playerAtxt.y = textHeight + 15;
    sideBuildingALayer.addChild(playerAtxt);

    // B玩家的状态
    playerBStatusLayer = new LSprite();
    addChild(playerBStatusLayer);
    playerBStatusLayer.graphics.drawRect(0, "#000000", [sideBuildingPaddingLeft + sideBuildingWidth + playerStatusWidth + 20, textHeight, playerStatusWidth, sideBuildingHeight]);
    playerBtxt = new LTextField();
    playerBtxt.size = 10;
    playerBtxt.x = sideBuildingPaddingLeft + sideBuildingWidth + playerStatusWidth + 40;
    playerBtxt.y = textHeight + 15;
    playerBStatusLayer.addChild(playerBtxt);

    // 游戏主体
    gameLayer = new LSprite();
    addChild(gameLayer);
    gameLayer.graphics.drawRect(1, "#000000", [0, mainPaddingTop, gameWidth, gameHeight], true, "#000000");

    // 车库
    sideBuildingBLayer = new LSprite();
    addChild(sideBuildingBLayer);
    sideBuildingBLayer.graphics.drawRect(1, "#000000", [sideBuildingPaddingLeft, mainPaddingTop + gameHeight, sideBuildingWidth, sideBuildingHeight]);
    var sideBuildingBText = new LTextField();
    sideBuildingBText.text = "车库";
    sideBuildingBText.size = 20;
    sideBuildingBText.x = sideBuildingPaddingLeft + 20;
    sideBuildingBText.y = mainPaddingTop + gameHeight + 15;
    sideBuildingBLayer.addChild(sideBuildingBText);

    // 游戏说明
    var specificationLayer = new LSprite();
    addChild(specificationLayer);
    specificationLayer.graphics.drawRect(0, "#000000", [sideBuildingPaddingLeft + sideBuildingWidth, mainPaddingTop + gameHeight, 300, sideBuildingHeight]);
    var specificationTxt = new LTextField();
    specificationTxt.text = "刘超: wasd 移动 j键攻击；程远: ↑↓←→ 移动 数字0攻击";
    specificationTxt.size = 10;
    specificationTxt.x = sideBuildingPaddingLeft + sideBuildingWidth + 20;
    specificationTxt.y = mainPaddingTop + gameHeight + 15;
    specificationLayer.addChild(specificationTxt);

    plainLayer = new LSprite();
    gameLayer.addChild(plainLayer);
    bulletLayer = new LSprite();
    gameLayer.addChild(bulletLayer);
    bulletCtrlLayer = new LSprite();
    gameLayer.addChild(bulletCtrlLayer);
    textLayer = new LSprite();

    gameLayer.addChild(textLayer);

    frameText = new LTextField();
    frameText.color = "#ffffff";
    frameText.x = 10;
    frameText.y = 10 + mainPaddingTop;

    environmentLayer = new LSprite();
    var companyLogo = new LBitmapData(imglist["egeiologo"]);
    company = new Egeio(gameWidth, mainPaddingTop + gameHeight / 2 - 50, companyLogo, company_init_money, company_init_potential);
    environmentLayer.addChild(company);
    gameLayer.addChild(environmentLayer);

    var bitmapData = new LBitmapData(imglist["playerA"]);
    playerA = new Player(700, 150 + mainPaddingTop, 0, bitmapData.height * 0.5, 6, bitmapData, "liuchao");
    plainLayer.addChild(playerA);
    playerA.setBullet(0);

    var bitmapData2 = new LBitmapData(imglist["playerB"]);
    playerB = new Player(700, 300 + mainPaddingTop, 0, bitmapData2.height * 0.5, 4, bitmapData2, "chengyuan");
    plainLayer.addChild(playerB);
    playerB.setBullet(0);

    gameLayer.addEventListener(LEvent.ENTER_FRAME, onframe);
    LEvent.addEventListener(LGlobal.window, LKeyboardEvent.KEY_DOWN, keydown);
    LEvent.addEventListener(LGlobal.window, LKeyboardEvent.KEY_UP, keyup);
}

/**
 * 循环
 * */
function onframe() {
    var key;
    for (key in plainLayer.childList) {
        plainLayer.childList[key].onframe();
    }
    for (key in bulletLayer.childList) {
        bulletLayer.childList[key].onframe();
    }
    for (key in bulletCtrlLayer.childList) {
        bulletCtrlLayer.childList[key].onframe();
    }
    for (key in environmentLayer.childList) {
        environmentLayer.childList[key].onframe();
    }
    setObject();
    showText();
}

function setObject() {
    if (frame++ < 10)
        return;
    frame = 0;
    frames++;

    // 随机事件
    if (frames % 50 == 0) {
        var bulletIndex = Math.random() > 0.5 ? 1 : 2;
        var obj = new BulletCtrl({
            x: 0, y: mainPaddingTop + Math.random() * gameHeight - 30, xspeed: 1, yspeed: 0,
            bulletIndex: bulletIndex, bitmapData: new LBitmapData(imglist["item" + bulletIndex])
        });
        bulletCtrlLayer.addChild(obj);
    }

    if (frames == companyIncreaseRateResetFrame) {
        company.increase_rate = 1;
    }

    if (frames == playerABulletResetFrame) {
        playerA.setBullet(0);
    }

    if (frames == playerBBulletResetFrame) {
        playerB.setBullet(0);
    }

    if (frames % 10 == 0) {
        var posy = Math.random() * (gameHeight - 50) + mainPaddingTop;
        var enemy;
        var bitmapData = new LBitmapData(imglist[this.getImg2()]);
        enemy = new Enemy(0, posy, 4, bitmapData, 1 + frames / 160, 1 + frames / 320, "bug");
        enemy.moveX = 1;
        enemy.moveY = 0;
        plainLayer.addChild(enemy);
    }

    if (frames % 25 == 0) {
        var posy = Math.random() * (gameHeight - 50) + mainPaddingTop;
        var enemy;
        var bitmapData = new LBitmapData(imglist[this.getImg1()]);
        enemy = new Enemy(0, posy, 3, bitmapData, 3 + frames / 160, frames / 320, "market");
        enemy.moveX = 1;
        enemy.moveY = 0;
        plainLayer.addChild(enemy);
    }

    if (frames > 320) {
        if (frames % 15 == 0) {
            var posy = Math.random() * (gameHeight - 50) + mainPaddingTop;
            var enemy;
            var bitmapData = new LBitmapData(imglist[this.getImg2()]);
            enemy = new Enemy(0, posy, 5, bitmapData, 1 + frames / 160, 1 + frames / 320, "bug");
            enemy.moveX = 1;
            enemy.moveY = 0;
            plainLayer.addChild(enemy);
        }

        if (frames % 45 == 0) {
            var posy = Math.random() * (gameHeight - 50) + mainPaddingTop;
            var enemy;
            var bitmapData = new LBitmapData(imglist[this.getImg1()]);
            enemy = new Enemy(0, posy, 4, bitmapData, 3 + frames / 160, frames / 320, "market");
            enemy.moveX = 1;
            enemy.moveY = 0;
            plainLayer.addChild(enemy);
        }
    }

    if (frames > 640) {
        if (frames % 12 == 0) {
            var posy = Math.random() * (gameHeight - 50) + mainPaddingTop;
            var enemy;
            var bitmapData = new LBitmapData(imglist[this.getImg2()]);
            enemy = new Enemy(0, posy, 6, bitmapData, 1 + frames / 160, 1 + frames / 320, "bug");
            enemy.moveX = 1;
            enemy.moveY = 0;
            plainLayer.addChild(enemy);
        }

        if (frames % 52 == 0) {
            var posy = Math.random() * (gameHeight - 50) + mainPaddingTop;
            var enemy;
            var bitmapData = new LBitmapData(imglist[this.getImg1()]);
            enemy = new Enemy(0, posy, 5, bitmapData, 3 + frames / 160, frames / 320, "market");
            enemy.moveX = 1;
            enemy.moveY = 0;
            plainLayer.addChild(enemy);
        }
    }
}

function showText() {
    frameText.text = "frames:" + frames;

    var money = parseInt(company.money) >= 0 ? parseInt(company.money) : 0;
    var potential = parseInt(company.potential) >= 0 ? parseInt(company.potential) : 0;

    cashText.text = "剩余流动资金:$" + money;
    potentialText.text = "公司估值:$" + potential;
    statusText.text = "公司发展状况:" + company.company_status+ "  frames"+frames;
}

function gameClear() {
    gameLayer.die();

    // 播放游戏胜利音乐
    var bgm1 = document.getElementById("bgm1");
    bgm1.pause();
    var game_win = document.getElementById("game_win");
    game_win.play();

    var overLayer = new LSprite();
    gameLayer.graphics.drawRect(1, "#000000", [0, mainPaddingTop, gameWidth, gameHeight], true, "#000000");
    gameLayer.addChild(overLayer);
    overLayer.graphics.drawRect(4, '#ff8800', [0, 0, 300, 100], true, '#ffffff');
    overLayer.x = (LGlobal.width - overLayer.getWidth()) * 0.5 - 50;
    overLayer.y = (LGlobal.height - overLayer.getHeight()) * 0.5;

    var txt = new LTextField();
    txt.text = "恭喜！！公司上市成功！！";
    txt.size = 10;
    txt.x = 20;
    txt.y = 20;
    overLayer.addChild(txt);

    var invite_code = new LTextField();
    invite_code.text = "赠送云方邀请码：ASXCASFEW";
    invite_code.size = 10;
    invite_code.x = 20;
    invite_code.y = 40;
    overLayer.addChild(invite_code);

    var txt1 = new LTextField();
    txt1.text = "请到www.fangcloud.com注册使用！";
    txt1.size = 10;
    txt1.x = 20;
    txt1.y = 60;
    overLayer.addChild(txt1);
}

function gameOver() {
    gameLayer.die();

    // 播放游戏失败的音乐
    var bgm1 = document.getElementById("bgm1");
    bgm1.pause();
    var game_lose = document.getElementById("game_lose");
    game_lose.play();

    gameLayer.graphics.drawRect(1, "#000000", [0, mainPaddingTop, gameWidth, gameHeight], true, "#000000");
    var overLayer = new LSprite();
    gameLayer.addChild(overLayer);
    overLayer.graphics.drawRect(4, '#ff8800', [0, 0, 300, 100], true, '#ffffff');
    overLayer.x = (LGlobal.width - overLayer.getWidth()) * 0.5 - 50;
    overLayer.y = (LGlobal.height - overLayer.getHeight()) * 0.5;

    var txt = new LTextField();
    txt.text = "公司前景过差，融资失败！！";
    txt.size = 10;
    txt.x = 20;
    txt.y = 40;
    overLayer.addChild(txt);

    var txt2 = new LTextField();
    txt2.text = "请重新再来";
    txt2.size = 10;
    txt2.x = 20;
    txt2.y = 60;
    overLayer.addChild(txt2);
}

function getImg1() {
    var random = Math.random() * 6;
    if (random < 1)
        return "gokuai";
    if (random < 2)
        return "kaipucloud";
    if (random < 3)
        return "kingsoft";
    if (random < 4)
        return "maike";
    if (random < 5)
        return "sohu";
    return "youdao";
}

function getImg2() {
    var random = Math.random() * 4;
    if (random < 1)
        return "enemy1";
    if (random < 2)
        return "enemy2";
    if (random < 3)
        return "enemy3";
    return "enemy4";
}



function keydown(event) {
    switch (event.keyCode) {
        case 87:
            playerA.moveY = -1;
            break;
        case 65:
            playerA.moveX = -1;
            break;
        case 83:
            playerA.moveY = 1;
            break;
        case 68:
            playerA.moveX = 1;
            break;
        case 38:
            playerB.moveY = -1;
            break;
        case 37:
            playerB.moveX = -1;
            break;
        case 40:
            playerB.moveY = 1;
            break;
        case 39:
            playerB.moveX = 1;
            break;
        case 74:
            playerA.shooting = true;
            break;
        case 96:
            playerB.shooting = true;
            break;
    }
}
function keyup(event) {
    switch (event.keyCode) {
        case 87:
            playerA.moveY = 0;
            break;
        case 65:
            playerA.moveX = 0;
            break;
        case 83:
            playerA.moveY = 0;
            break;
        case 68:
            playerA.moveX = 0;
            break;
        case 38:
            playerB.moveY = 0;
            break;
        case 37:
            playerB.moveX = 0;
            break;
        case 40:
            playerB.moveY = 0;
            break;
        case 39:
            playerB.moveX = 0;
            break;
        case 74:
            playerA.shooting = false;
            return;
        case 96:
            playerB.shooting = false;
            return;
    }
}
