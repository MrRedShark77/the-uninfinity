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
    player.PV_powers = player.PV_powers.add(FORMULA.pv_generator.ps(0).mul(dt/1000))
    player.areaity.powers = player.areaity.powers.mul(FORMULA.areaity.ps().pow(dt/1000))
    if (player.studies.upgs.includes(141)) {
        player.pAreas.points = player.pAreas.points.add(FORMULA.planckAreas_gain().mul(dt/100000))
        player.pAreas.times = player.pAreas.times.add(FORMULA.pa_stat_gain().mul(dt/100000))
    }
    for (let i = 0; i < 7; i++) {
        player.generators[i][0] = player.generators[i][0].add((FORMULA.gps(i+1)).mul(dt/1000))
        player.PA_generators[i][0] = player.PA_generators[i][0].add((FORMULA.pa_generator.ps(i+1)).mul(dt/1000))
        if (i < 3) player.PV_generators[i][0] = player.PV_generators[i][0].add((FORMULA.pv_generator.ps(i+1)).mul(dt/1000))
    }
    for (let c = 1; c <= ACHIEVEMENTS.unls.col; c++) for (let r = 1; r <= ACHIEVEMENTS.unls.row; r++) if (ACHIEVEMENTS.unls[10*c+r].req()) unlockAchievement(c*10+r)
    if (player.money.gte('e300')) unlockFeature('planckAreas')
    if (player.money.gte('e88500')) unlockFeature('PA_Generators')
    for (let i = 0; i < 8; i++) {
        if (player.generators_autobuyer[i][0]) bulkGen(i)
        if (player.generators_autobuyer[i][1]) tierGenerator(i)
        if (player.pa_generators_autobuyer[i][0] && player.PA_gen_unls > i) bulkAGen(i)
        if (player.pa_generators_autobuyer[i][1] && player.PA_gen_unls > i) tierPAGenerator(i)
    }
    if (player.mults_autobuyer[0]) bulkMult()
    if (player.mults_autobuyer[1]) tierMult()
    if (player.metas_autobuyer[0]) buyMeta()
    if (player.metas_autobuyer[1]) tierMeta()
    if (player.PA_mult_autobuyer) if (FORMULA.pa_mult.bulk().gt(player.PA_mult)) {
        player.PA_mult = FORMULA.pa_mult.bulk()
        player.pAreas.points = player.pAreas.points.sub(FORMULA.pa_mult.cost(player.PA_mult.sub(1)))
    }
    if (document.getElementById('treeStudy') && !player.open_study) {
        player.open_study = true
        resizeCanvas()
    } else {
        player.open_study = false
    }
    for (let c = 1; c <= CHALLENGE.pAreas.col; c++) for (let r = 1; r <= CHALLENGE.pAreas.row; r++) if (CHALLENGE.pAreas[c*10+r].unl()) unlockPAChal(c*10+r)
    for (let i = 0; i < 3; i++) if (player.areaity.autobuys[i] && player.areaity.unl) FORMULA.areaity.upgs.max(i+1)
}

function wipe() {
    player = {
        money: E(10),
        pAreas: {
            points: E(0),
            times: E(0),
            upgs: [],
        },
        pVolumes: {
            points: E(0),
            times: E(0),
            upgs: [],
        },
        volume_chal: {
            unl: [],
            enabled: 0,
            active: 0,
            completed: {},
        },
        PV_generators: [],
        studies: {
            total: 0,
            spent: 0,
            gain_vt: [0,0,0],
            upgs: [],
        },
        areaity: {
            unl: false,
            powers: E(1),
            upgs: [0,0,0],
            metas: 0,
            autobuys: [false,false,false,false],
        },
        ticks: 0,
        generators: [],
        gen_tetr: [],
        generators_autobuyer: [],
        pa_generators_autobuyer: [],
        mults: E(0),
        mults_autobuyer: [false,false],
        metas_autobuyer: [false,false],
        multTiers: E(1),
        multTetrs: E(1),
        metas: E(0),
        metaTiers: E(1),
        sacrifice: E(1),
        PA_chal: {
            unl: [],
            active: 0,
            completed: [],
        },
        PA_mult: E(0),
        PV_mult: E(0),
        PA_mult_autobuyer: false,
        PA_generators: [],
        PA_gen_unls: 0,
        PA_powers: E(0),
        PV_powers: E(0),
        PG_upgs: [],
        tab: 0,
        stab: 0,
        open_study: false,
        respec: false,
        achievements: [],
        unls: [],
    }
    for (let i = 0; i < 8; i++) player.generators.push([E(0),E(0),E(1)])
    for (let i = 0; i < 8; i++) player.gen_tetr.push(E(1))
    for (let i = 0; i < 8; i++) player.PA_generators.push([E(0),E(0),E(1)])
    for (let i = 0; i < 8; i++) player.PV_generators.push([E(0),E(0),E(1)])
    for (let i = 0; i < 8; i++) player.generators_autobuyer.push([false,false])
    for (let i = 0; i < 8; i++) player.pa_generators_autobuyer.push([false,false])
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
    if (load.pa_generators_autobuyer != undefined) player.pa_generators_autobuyer = load.pa_generators_autobuyer
    if (load.mults_autobuyer != undefined) player.mults_autobuyer = load.mults_autobuyer
    if (load.PA_chal != undefined) player.PA_chal = load.PA_chal
    if (load.volume_chal != undefined) player.volume_chal = load.volume_chal
    if (load.PA_mult != undefined) player.PA_mult = ex(load.PA_mult)
    if (load.PV_mult != undefined) player.PV_mult = ex(load.PV_mult)
    if (load.PA_gen_unls != undefined) player.PA_gen_unls = load.PA_gen_unls
    if (load.PA_generators != undefined) for (let i = 0; i < 8; i++) for (let j = 0; j < 3; j++) player.PA_generators[i][j] = ex(load.PA_generators[i][j])
    if (load.gen_tetr != undefined) for (let i = 0; i < 8; i++) player.gen_tetr[i] = ex(load.gen_tetr[i])
    if (load.PA_powers != undefined) player.PA_powers = ex(load.PA_powers)
    if (load.PG_upgs != undefined) player.PG_upgs = load.PG_upgs
    if (load.metaTiers != undefined) player.metaTiers = ex(load.metaTiers)
    if (load.multTetrs != undefined) player.multTetrs = ex(load.multTetrs)
    if (load.metas_autobuyer != undefined) player.metas_autobuyer = load.metas_autobuyer
    if (load.PA_mult_autobuyer != undefined) player.PA_mult_autobuyer = load.PA_mult_autobuyer
    if (load.pVolumes != undefined) player.pVolumes = {
        points: ex(load.pVolumes.points),
        times: ex(load.pVolumes.times),
        upgs: load.pVolumes.upgs,
    }
    if (load.PV_generators != undefined) for (let i = 0; i < 8; i++) for (let j = 0; j < 3; j++) player.PV_generators[i][j] = ex(load.PV_generators[i][j])
    if (load.PV_powers != undefined) player.PV_powers = ex(load.PV_powers)
    if (load.studies != undefined) player.studies = load.studies
    if (load.areaity != undefined) player.areaity = {
        unl: load.areaity.unl,
        powers: ex(load.areaity.powers),
        upgs: load.areaity.upgs,
        metas: load.areaity.metas,
        autobuys: load.areaity.autobuys,
    }
}

function loadGame() {
    wipe()
    load(localStorage.getItem("uninfinitySave"))
    loadVue()
    setInterval(save,1000)
}