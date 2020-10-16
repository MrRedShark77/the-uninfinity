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
    player.PA_powers = player.PA_powers.add(FORMULA.pa_generator.ps(0).mul(dt/1000))
    for (let i = 0; i < 7; i++) {
        player.generators[i][0] = player.generators[i][0].add((FORMULA.gps(i+1)).mul(dt/1000))
        player.PA_generators[i][0] = player.PA_generators[i][0].add((FORMULA.pa_generator.ps(i+1)).mul(dt/1000))
    }
    for (let c = 1; c <= ACHIEVEMENTS.unls.col; c++) for (let r = 1; r <= ACHIEVEMENTS.unls.row; r++) if (ACHIEVEMENTS.unls[10*c+r].req()) unlockAchievement(c*10+r)
    if (player.money.gte('e300')) unlockFeature('planckAreas')
    if (player.money.gte('e66000')) unlockFeature('PA_Generators')
    for (let i = 0; i < 8; i++) {
        if (player.generators_autobuyer[i][0]) bulkGen(i)
        if (player.generators_autobuyer[i][1]) tierGenerator(i)
    }
    if (player.mults_autobuyer[0]) bulkMult()
    if (player.mults_autobuyer[1]) tierMult()
    for (let c = 1; c <= CHALLENGE.pAreas.col; c++) for (let r = 1; r <= CHALLENGE.pAreas.row; r++) if (CHALLENGE.pAreas[c*10+r].unl()) unlockPAChal(c*10+r)
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
        generators_autobuyer: [],
        mults: E(0),
        mults_autobuyer: [false,false],
        multTiers: E(1),
        metas: E(0),
        sacrifice: E(1),
        PA_chal: {
            unl: [],
            active: 0,
            completed: [],
        },
        PA_mult: E(0),
        PA_generators: [],
        PA_gen_unls: 0,
        PA_powers: E(0),
        tab: 0,
        stab: 0,
        achievements: [],
        unls: [],
    }
    for (let i = 0; i < 8; i++) player.generators.push([E(0),E(0),E(1)])
    for (let i = 0; i < 8; i++) player.PA_generators.push([E(0),E(0),E(1)])
    for (let i = 0; i < 8; i++) player.generators_autobuyer.push([false,false])
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
    if (load.generators_autobuyer != undefined) player.generators_autobuyer = load.generators_autobuyer
    if (load.mults_autobuyer != undefined) player.mults_autobuyer = load.mults_autobuyer
    if (load.PA_chal != undefined) player.PA_chal = load.PA_chal
    if (load.PA_mult != undefined) player.PA_mult = ex(load.PA_mult)
    if (load.PA_gen_unls != undefined) player.PA_gen_unls = load.PA_gen_unls
    if (load.PA_generators != undefined) for (let i = 0; i < 8; i++) for (let j = 0; j < 3; j++) player.PA_generators[i][j] = ex(load.PA_generators[i][j])
    if (load.PA_powers != undefined) player.PA_powers = ex(load.PA_powers)
}

function loadGame() {
    wipe()
    load(localStorage.getItem("uninfinitySave"))
    loadVue()
    setInterval(save,1000)
}