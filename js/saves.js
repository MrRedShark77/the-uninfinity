function upd(x,y){document.getElementById(x).innerHTML = y};
function E(x){return new ExpantaNum(x)};

function ex(x){
    let nx = new E(0);
    nx.array = x.array;
    nx.sign = x.sign;
    nx.layer = x.layer;
    return nx;
}

function achImage(n) {
    if (ACHIEVEMENTS.unls[n].img) return 'placeholder'
    else return n
}

addEventListener("keydown", function(e){
    if (e.keyCode == 77) buyMax()
}, false);

function calc(dt) {
    player.ticks += dt
    player.money = player.money.add(FORMULA.gps(0).mul(dt/1000))
    for (let i = 0; i < 7; i++) {
        player.generators[i][0] = player.generators[i][0].add((FORMULA.gps(i+1)).mul(dt/1000))
    }
    for (let c = 1; c <= ACHIEVEMENTS.unls.col; c++) for (let r = 1; r <= ACHIEVEMENTS.unls.row; r++) if (ACHIEVEMENTS.unls[10*c+r].req()) unlockAchievement(c*10+r)
    if (player.money.gte('e300')) unlockFeature('planckAreas')
}

function wipe() {
    player = {
        money: E(10),
        pAreas: {
            points: E(0),
            times: E(0),
            upgs: [],
        },
        ticks: 0,
        generators: [],
        mults: E(0),
        multTiers: E(1),
        metas: E(0),
        sacrifice: E(1),
        tab: 0,
        stab: 0,
        achievements: [],
        unls: [],
    }
    for (let i = 0; i < 8; i++) player.generators.push([E(0),E(0),E(1)])
}

function save(){
    if (localStorage.getItem("uninfinitySave") == '') wipe()
    localStorage.setItem("uninfinitySave",btoa(JSON.stringify(player)))
}
    
function load(x){
    if(typeof x == "string" & x != ''){
        loadPlayer(JSON.parse(atob(x)))
    } else {
        wipe()
    }
}

function exporty() {
    save();
    let file = new Blob([btoa(JSON.stringify(player))], {type: "text/plain"})
    window.URL = window.URL || window.webkitURL;
    let a = document.createElement("a")
    a.href = window.URL.createObjectURL(file)
    a.download = "Uninfinity Save.txt"
    a.click()
}

function importy() {
    let loadgame = prompt("Paste in your save WARNING: WILL OVERWRITE YOUR CURRENT SAVE")
    if (loadgame != "") {
        load(loadgame)
    }
}

function loadPlayer(load) {
    player.money = ex(load.money)
    for (let i = 0; i < 8; i++) for (let j = 0; j < 3; j++) player.generators[i][j] = ex(load.generators[i][j])
    player.mults = ex(load.mults)
    player.multTiers = ex(load.multTiers)
    player.metas = ex(load.metas)
    player.sacrifice = ex(load.sacrifice)
    player.achievements = load.achievements
    player.unls = load.unls
    player.pAreas = {
        points: ex(load.pAreas.points),
        times: ex(load.pAreas.times),
        upgs: load.pAreas.upgs,
    }
    player.ticks = load.ticks
}

function loadGame() {
    wipe()
    load(localStorage.getItem("uninfinitySave"))
    loadVue()
    setInterval(save,1000)
}