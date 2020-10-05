var diff = 0;
var date = Date.now();

var player;

const EXP_COST = [E(2),E(3),E(5),E(8),E(12),E(18),E(25),E(36)]

const TABS = ['Generators','Achievements','Options','Planck Area']

const TABS_UNLS = {
    'Generators': () => { return true },
    'Achievements': () => { return true },
    'Options': () => { return true },
    'Planck Area': () => { return player.unls.includes('planckAreas') },
}

const FUNCTIONS = {
    0: (x) => { return E(x).pow(2).add(x).div(2) },
}

const FORMULA = {
    generator_cost: (x, y, z) => { return y.lt(100)?E(10).pow(EXP_COST[x].mul(FUNCTIONS[0](z)).mul(y.add(1).add(z.sub(1).mul(100))).sub(1)):Infinity },
    generator_boost: (x, y, z) => { return E(y.add(player.pAreas.upgs.includes(12)?1.5:1)
        .mul(player.achievements.includes(19)?1.05:1)
        .mul(player.achievements.includes(20)?1.05:1)
        .mul(player.achievements.includes(30)?1.1:1))
        .pow(x.add(y.sub(1).mul(100)))
        .mul(FORMULA.mult_boost())
        .mul(player.pAreas.upgs.includes(11)?UPGRADE.pAreas[11].cur():1)
        .mul(player.pAreas.upgs.includes(41)?UPGRADE.pAreas[41].cur():1)
        .mul((z == 0)?(player.pAreas.upgs.includes(21)?UPGRADE.pAreas[21].cur():1):1)
        .mul((z == 1)?(player.pAreas.upgs.includes(22)?UPGRADE.pAreas[22].cur():1):1)
        .mul((z == 2)?(player.pAreas.upgs.includes(31)?UPGRADE.pAreas[31].cur():1):1)
        .mul((z == 3)?(player.pAreas.upgs.includes(32)?UPGRADE.pAreas[32].cur():1):1)
        .mul((z == 4)?(player.pAreas.upgs.includes(32)?UPGRADE.pAreas[32].cur():1):1)
        .mul((z == 5)?(player.pAreas.upgs.includes(31)?UPGRADE.pAreas[31].cur():1):1)
        .mul((z == 6)?(player.pAreas.upgs.includes(22)?UPGRADE.pAreas[22].cur():1):1)
        .mul((z == 7)?player.sacrifice.mul(player.pAreas.upgs.includes(21)?UPGRADE.pAreas[21].cur():1):1) },
    generator_bulk: (x, y, z) => { return E(y).log10().add(1).div(EXP_COST[x]).div(FUNCTIONS[0](z)).sub(z.sub(1).mul(100)).floor().max(0).min(100) },
    gps: (x) => { return player.generators[x][0].mul(FORMULA.generator_boost(player.generators[x][1], player.generators[x][2], x)) },
    mult_cost: (x) => { return x.lt(100)?E(10).pow(E(x).add(player.multTiers.sub(1).mul(100)).mul(FUNCTIONS[0](player.multTiers)).add(3)):Infinity },
    mult_boost: () => { return E(FORMULA.mult_base()).pow(player.mults.add(player.multTiers.sub(1).mul(100))) },
    mult_base: () => { return E(1.125).pow(FORMULA.meta_boost().mul(player.multTiers).mul(player.achievements.includes(23)?1.02:1)) },
    mult_bulk: (x) => { return E(x).log10().sub(3).div(FUNCTIONS[0](player.multTiers)).sub(player.multTiers.sub(1).mul(100)).add(1).floor().max(0).min(100) },
    meta_cost: () => { return player.metas.mul(2).add(1) },
    meta_boost: () => { return player.metas.mul(player.achievements.includes(24)?1.1:1).mul(player.achievements.includes(27)?1.25:1).mul(player.pAreas.upgs.includes(42)?2:1).add(1).pow(1/3) },
    gen8_have: () => { return player.generators[7][1].add(player.generators[7][2].sub(1).mul(100)) },
    sacrifice: () => { return player.money.add(1).log10().add(1).div(player.sacrifice).mul(2).max(1) },
    planckAreas_gain: () => { return player.money.add(1).log10().div(100).sub(2).pow(1/2).floor().max(0) },
}

const UPGRADE = {
    pAreas: {
        row: 2,
        col: 4,
        11: {
            desc: 'Generators gain a multipler based on time played.',
            unl: () => { return true },
            cost: () => E(1),
            cur: () => { return E(player.ticks).add(1).log10().sub(2).max(1) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        12: {
            desc: 'Increase the starting multiplier for buying Generators. x2 -> x2.5',
            unl: () => { return true },
            cost: () => E(1),
        },
        21: {
            desc: 'PA reset times boost Generators 1 & 8.',
            unl: () => { return true },
            cost: () => E(2),
            cur: () => { return player.pAreas.times.mul(0.2).add(1) },
            curDesc: (x) => { return 'x'+notate(x,1) },
        },
        22: {
            desc: 'PA reset times boost Generators 2 & 7.',
            unl: () => { return true },
            cost: () => E(2),
            cur: () => { return player.pAreas.times.mul(0.2).add(1) },
            curDesc: (x) => { return 'x'+notate(x,1) },
        },
        31: {
            desc: 'PA reset times boost Generators 3 & 6.',
            unl: () => { return true },
            cost: () => E(2),
            cur: () => { return player.pAreas.times.mul(0.2).add(1) },
            curDesc: (x) => { return 'x'+notate(x,1) },
        },
        32: {
            desc: 'PA reset times boost Generators 4 & 5.',
            unl: () => { return true },
            cost: () => E(2),
            cur: () => { return player.pAreas.times.mul(0.2).add(1) },
            curDesc: (x) => { return 'x'+notate(x,1) },
        },
        41: {
            desc: 'Planck Areas boost Generators.',
            unl: () => { return true },
            cost: () => E(3),
            cur: () => { return player.pAreas.points.add(1).pow(1.5) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        42: {
            desc: 'Meta Powers are twice as effective.',
            unl: () => { return true },
            cost: () => E(5),
        },
    },
}

const ACHIEVEMENTS = {
    unls: {
        row: 10,
        col: 2,
        11: {
            title: 'You gotta start',
            desc: 'Buy Generator 1.',
            req: () => { return player.generators[0][1].gte(1) },
        },
        12: {
            title: 'Lot of 100!',
            desc: 'Buy Generator 2.',
            req: () => { return player.generators[1][1].gte(1) },
        },
        13: {
            title: "Value haven't 3",
            desc: 'Buy Generator 3.',
            req: () => { return player.generators[2][1].gte(1) },
        },
        14: {
            title: '404, has not found',
            desc: 'Buy Generator 4.',
            req: () => { return player.generators[3][1].gte(1) },
        },
        15: {
            title: '2+2=5',
            desc: 'Buy Generator 5.',
            req: () => { return player.generators[4][1].gte(1) },
        },
        16: {
            title: 'Flipped 6 is 9 exists?',
            desc: 'Buy Generator 6.',
            req: () => { return player.generators[5][1].gte(1) },
        },
        17: {
            title: 'Seven gets wrong',
            desc: 'Buy Generator 7.',
            req: () => { return player.generators[6][1].gte(1) },
        },
        18: {
            title: 'Half-flipped 8',
            desc: 'Buy Generator 8.',
            req: () => { return player.generators[7][1].gte(1) },
        },
        19: {
            title: 'Where is 9th achievements?',
            desc: 'Buy 9 Multipler Powers. Reward: Generators is 5% stronger.',
            req: () => { return player.mults.gte(9) },
        },
        20: {
            title: 'Googol PL',
            desc: 'Gain 1e100 Planck Lengths. Reward: Generators is 5% stronger.',
            req: () => { return player.money.gte(1e100) },
        },
        21: {
            title: 'NOT galaxy, its META',
            desc: 'Get one Meta Powers.',
            req: () => { return player.metas.gte(1) },
        },
        22: {
            title: 'Double Metas',
            desc: 'Gain 2 Meta Powers.',
            req: () => { return player.metas.gte(2) },
        },
        23: {
            title: 'Upgrade Multipler',
            desc: 'Tier Multiplers (if Multipler Powers reached 100). Reward: Multipler Base is 2% stronger.',
            req: () => { return player.multTiers.gte(2) },
        },
        24: {
            title: 'Upgrade Again',
            desc: 'Reach Multipler Tier 3. Reward: Meta Effect is 10% stronger.',
            req: () => { return player.multTiers.gte(3) },
        },
        25: {
            title: '(Planck Lengths)^2',
            desc: 'Get Planck Areas. Reward: Start with 200 Planck Lengths.',
            req: () => { return player.pAreas.times.gte(1) },
        },
        26: {
            title: 'More Times...',
            desc: 'Transform PL 10 times.',
            req: () => { return player.pAreas.times.gte(10) },
        },
        27: {
            title: "I didn't need Meta Powers!",
            desc: 'Transform PL without having Meta Powers. Reward: Meta Effect is 25% stronger.',
            req: () => { return false },
        },
        28: {
            title: 'Placeholder',
            desc: 'Placeholder.',
            img: true,
            req: () => { return false },
        },
        29: {
            title: 'Placeholder',
            desc: 'Placeholder.',
            img: true,
            req: () => { return false },
        },
        30: {
            title: 'Cubed Googol',
            desc: 'Reach 1e300 Planck Lengths. Reward: Generators is 10% stronger.',
            req: () => { return player.money.gte(1e300) },
        },
    },
    secrets: {

    },
}

function buyUPG(upg, id) {
    let cost = UPGRADE[upg][id].cost()
    if (player[upg].points.gte(cost) & !player[upg].upgs.includes(id)) {
        player[upg].points = player[upg].points.sub(cost)
        player[upg].upgs.push(id)
    }
}

function unlockAchievement(id) {
    if (!player.achievements.includes(id)) {
        player.achievements.push(id)
        $.notify(ACHIEVEMENTS.unls[id].title, 'success')
    }
}

function unlockFeature(id) {
    if (!player.unls.includes(id)) {
        player.unls.push(id)
    }
}

function buyGenerator(x, y, z) {
    let cost = FORMULA.generator_cost(x, y, z)
    if (player.money.gte(cost)) {
        player.money = player.money.sub(cost)
        player.generators[x][0] = player.generators[x][0].add(1)
        player.generators[x][1] = player.generators[x][1].add(1)
    }
}

function tierGenerator(x) {
    if (player.generators[x][1].gte(100)) {
        player.generators[x][1] = E(0)
        player.generators[x][2] = player.generators[x][2].add(1)
    }
}

function tierMult() {
    if (player.mults.gte(100)) {
        player.mults = E(0)
        player.multTiers = player.multTiers.add(1)
    }
}

function buyMult() {
    let cost = FORMULA.mult_cost(player.mults)
    if (player.money.gte(cost)) {
        player.money = player.money.sub(cost)
        player.mults = player.mults.add(1)
    }
}

function buyMeta() {
    if (FORMULA.gen8_have().gte(FORMULA.meta_cost())) {
        player.metas = player.metas.add(1)
        player.money = E(player.achievements.includes(25)?200:10)
        player.generators = []
        for (let i = 0; i < 8; i++) player.generators.push([E(0),E(0),E(1)])
        player.mults = E(0)
        player.multTiers = E(1)
        unlockFeature('sacrifice')
        player.sacrifice = E(1)
    }
}

function buyMax() {
    if (FORMULA.mult_bulk(player.money).gt(player.mults)) {
        player.mults = FORMULA.mult_bulk(player.money)
        player.money = player.money.sub(FORMULA.mult_cost(FORMULA.mult_bulk(player.money).sub(1)))
    }
    for (let i = 0; i < 8; i++) {
        if (FORMULA.generator_bulk(i,player.money,player.generators[i][2]).gt(player.generators[i][1])) {
            player.generators[i][0] = player.generators[i][0].add(FORMULA.generator_bulk(i,player.money,player.generators[i][2]).sub(player.generators[i][1]))
            player.generators[i][1] = FORMULA.generator_bulk(i,player.money,player.generators[i][2])
            player.money = player.money.sub(FORMULA.generator_cost(i,FORMULA.generator_bulk(i,player.money,player.generators[i][2]).sub(player.generators[i][2].sub(1).mul(100).max(1)),player.generators[i][2]))
        }
    }
}

function sacrificeGen() {
    if (player.metas.gte(1) && FORMULA.gen8_have().gte(1)) {
        player.sacrifice = player.sacrifice.mul(FORMULA.sacrifice())
        for (let i = 0; i < 7; i++) player.generators[i][0] = E(0)
    }
}

function transformPL() {
    if (FORMULA.planckAreas_gain().gte(1)) {
        player.pAreas.points = player.pAreas.points.add(FORMULA.planckAreas_gain())
        player.pAreas.times = player.pAreas.times.add(1)
        if (player.metas.lte(0)) unlockAchievement(27)
        PLReset()
    }
}

function PLReset() {
    player.money = E(player.achievements.includes(25)?200:10)
    player.generators = []
    for (let i = 0; i < 8; i++) player.generators.push([E(0),E(0),E(1)])
    player.mults = E(0)
    player.multTiers = E(1)
    player.metas = E(0)
    player.sacrifice = E(1)
}

function notate(ex, acc=3) {
    ex = E(ex)
    if (ex.isInfinite()) return 'Infinity'
    let e = ex.log10().floor()
    if (e.lt(9)) {
        if (e.lt(3)) {
            return ex.toFixed(acc)
        }
        return ex.floor().toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    let m = ex.div(E(10).pow(e))
    return (e.log10().gte(9)?'':m.toFixed(3))+'e'+notate(e,0)
}

function loop(){
    diff = Date.now()-date;
    calc(diff);
    date = Date.now();
}

setInterval(loop, 50)