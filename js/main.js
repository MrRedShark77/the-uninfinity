var diff = 0;
var date = Date.now();

var player;

var chalText = (c, r) => { return (player.PA_chal.active == c*10+r)?(player.money.gte(CHALLENGE.pAreas[c*10+r].goal)?"Finish":'Exit'):(player.PA_chal.completed.includes(c*10+r)?'Finished':'Start') }

const EXP_COST = [E(2),E(3),E(5),E(8),E(12),E(18),E(25),E(36)]
const UNL_PA_GEN = [E('e79000'),E(Infinity)]

const TABS = ['Generators','Achievements','Options','Planck Area']

const STABS = {
    'Planck Area': ['Upgrades', 'Autobuyers', 'Challenges'],
    'Generators': ['Length Generators','Area Generators'],
}

const TABS_UNLS = {
    'Generators': () => { return true },
    'Achievements': () => { return true },
    'Options': () => { return true },
    'Planck Area': () => { return player.unls.includes('planckAreas') },
}

const STABS_UNLS = {
    'Planck Area': {
        'Upgrades': () => { return true },
        'Autobuyers': () => { return player.pAreas.times.gte(5) },
        'Challenges': () => { return true },
        'Post-Generators': () => { return player.unls.includes('PA_Generators') },
    },
    'Generators': {
        'Length Generators': () => { return true },
        'Area Generators': () => { return player.unls.includes('PA_Generators') },
    },
}

const FUNCTIONS = {
    0: (x) => { return (player.PA_chal.active == 12)?E(x).mul(E(x).add(1)).mul(E(x).add(2)).div(6):E(x).pow(2).add(x).div(2) },
}

const FORMULA = {
    generator_cost: (x, y, z) => {
        if (player.PA_chal.active == 22 && (x == 6 || x == 7)) return Infinity
        return y.lt(100)?E(10).pow(EXP_COST[x].mul(FUNCTIONS[0](z)).mul(y.add(1).add(z.sub(1).mul(100))).sub(1)):Infinity
    },
    generator_boost: (x, y, z) => { return E(y.add(player.pAreas.upgs.includes(12)?1.5:1)
        .mul(player.achievements.includes(19)?1.05:1)
        .mul(player.achievements.includes(20)?1.05:1)
        .mul((player.achievements.includes(28) && z == 7)?1.5:1)
        .mul(player.achievements.includes(29)?player.metas.add(1).log10().add(1):1)
        .mul(player.achievements.includes(30)?1.1:1)
        .mul(player.achievements.includes(40)?1.25:1)
        .mul(player.PA_chal.completed.includes(12)?2.25:1)
        .mul((player.PA_chal.completed.includes(22)&(z == 6 || z == 7))?10:1))
        .pow(x.add(y.sub(1).mul(100)))
        .mul(FORMULA.mult_boost())
        .mul(player.pAreas.upgs.includes(11)?UPGRADE.pAreas[11].cur():1)
        .mul(player.pAreas.upgs.includes(41)?UPGRADE.pAreas[41].cur():1)
        .mul(player.pAreas.upgs.includes(33)?UPGRADE.pAreas[33].cur():1)
        .mul(player.PA_chal.completed.includes(11)?CHALLENGE.pAreas[11].cur():1)
        .mul((z == 0)?(player.pAreas.upgs.includes(21)?UPGRADE.pAreas[21].cur():1):1)
        .mul((z == 1)?(player.pAreas.upgs.includes(22)?UPGRADE.pAreas[22].cur():1):1)
        .mul((z == 2)?(player.pAreas.upgs.includes(31)?UPGRADE.pAreas[31].cur():1):1)
        .mul((z == 3)?(player.pAreas.upgs.includes(32)?UPGRADE.pAreas[32].cur():1):1)
        .mul((z == 4)?(player.pAreas.upgs.includes(32)?UPGRADE.pAreas[32].cur():1):1)
        .mul((z == 5)?(player.pAreas.upgs.includes(31)?UPGRADE.pAreas[31].cur():1):1)
        .mul((z == 6)?(player.pAreas.upgs.includes(22)?UPGRADE.pAreas[22].cur():1):1)
        .mul((z == 7)?player.sacrifice.mul(player.pAreas.upgs.includes(21)?UPGRADE.pAreas[21].cur():1):1)
        .mul(FORMULA.pa_powers_eff())
        .pow((player.PA_chal.active == 21)?FORMULA.meta_boost().pow(1/2):1)
        .div((player.PA_chal.active == 11)?player.money.add(1).pow(0.1):1)
    },
    generator_bulk: (x, y, z) => {
        if (player.PA_chal.active == 22 && (x == 6 || x == 7)) return E(0)
        return E(y).log10().add(1).div(EXP_COST[x]).div(FUNCTIONS[0](z)).sub(z.sub(1).mul(100)).floor().max(0).min(100)
    },
    gps: (x) => { return player.generators[x][0].mul(FORMULA.generator_boost(player.generators[x][1], player.generators[x][2], x)) },
    mult_cost: (x) => { return (x.lt(100))?((player.PA_chal.active == 21)?Infinity:E(10).pow(E(x).add(player.multTiers.sub(1).mul(100)).mul(FUNCTIONS[0](player.multTiers)).add(3))):Infinity },
    mult_boost: () => { return E(FORMULA.mult_base()).pow(player.mults.add(player.multTiers.sub(1).mul(100))) },
    mult_base: () => { return E(player.pAreas.upgs.includes(23)?1.15:1.125)
        .pow(FORMULA.meta_boost().mul(player.multTiers)
        .mul(player.achievements.includes(23)?1.02:1)
        .mul(player.achievements.includes(31)?1.05:1))
    },
    mult_bulk: (x) => { return (player.PA_chal.active == 21)?E(0):E(x).log10().sub(3).div(FUNCTIONS[0](player.multTiers)).sub(player.multTiers.sub(1).mul(100)).add(1).floor().max(0).min(100) },
    meta_cost: () => { return player.metas.mul(2).add(1) },
    meta_boost: () => { return player.metas
        .mul(player.achievements.includes(24)?1.1:1)
        .mul(player.achievements.includes(27)?1.25:1)
        .mul(player.pAreas.upgs.includes(42)?2:1)
        .mul(player.PA_chal.completed.includes(21)?2:1)
        .add(1).pow(1/3)
    },
    meta_bulk: () => { return FORMULA.gen8_have().sub(player.metas.mul(2)).max(0).add(1).div(2).floor() },
    gen8_have: () => { return player.generators[7][1].add(player.generators[7][2].sub(1).mul(100)) },
    sacrifice: () => {
        let mul = player.money.add(1)
        if (player.pAreas.upgs.includes(43)) mul = mul.pow(1/10)
        else mul = mul.logBase(10)
        return mul.add(1).div(player.sacrifice).mul(2).max(1)
    },
    planckAreas_gain: () => { return player.money.add(1).log10().div(100).sub(2).pow(1/2).mul(FORMULA.pa_mult.boost()).floor().max(0) },
    pa_mult: {
        cost: () => { return E(4).pow(player.PA_mult).mul(10) },
        boost: () => { return E(2).pow(player.PA_mult) },
    },
    pa_generator: {
        ps: (x) => { return player.PA_generators[x][0].mul(FORMULA.pa_generator.boost(player.PA_generators[x][1], player.PA_generators[x][2], x)) },
        cost: (x, y, z) => { return y.lt(100)?E(10).pow(EXP_COST[x].mul(FUNCTIONS[0](z)).mul(y.add(1).add(z.sub(1).mul(100))).sub(1)):Infinity },
        boost: (x, y, z) => { return E(y.add(1)).pow(x) },
        bulk: (x, y, z) => { return E(y).log10().add(1).div(EXP_COST[x]).div(FUNCTIONS[0](z)).sub(z.sub(1).mul(100)).floor().max(0).min(100) },
    },
    pa_powers_eff: () => { return player.PA_powers.add(1).pow(100) },
}

const UPGRADE = {
    pAreas: {
        row: 3,
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
            desc: 'PA resets boost Generators 1 & 8.',
            unl: () => { return true },
            cost: () => E(2),
            cur: () => { return player.pAreas.times.mul(0.2).add(1) },
            curDesc: (x) => { return 'x'+notate(x,1) },
        },
        22: {
            desc: 'PA resets boost Generators 2 & 7.',
            unl: () => { return true },
            cost: () => E(2),
            cur: () => { return player.pAreas.times.mul(0.2).add(1) },
            curDesc: (x) => { return 'x'+notate(x,1) },
        },
        31: {
            desc: 'PA resets boost Generators 3 & 6.',
            unl: () => { return true },
            cost: () => E(2),
            cur: () => { return player.pAreas.times.mul(0.2).add(1) },
            curDesc: (x) => { return 'x'+notate(x,1) },
        },
        32: {
            desc: 'PA resets boost Generators 4 & 5.',
            unl: () => { return true },
            cost: () => E(2),
            cur: () => { return player.pAreas.times.mul(0.2).add(1) },
            curDesc: (x) => { return 'x'+notate(x,1) },
        },
        41: {
            desc: 'Planck Areas boost Generators.',
            unl: () => { return true },
            cost: () => E(3),
            cur: () => { return player.pAreas.points.add(1).pow(2) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        42: {
            desc: 'Meta Powers are twice as effective.',
            unl: () => { return true },
            cost: () => E(5),
        },
        13: {
            desc: 'Enable to bulk Meta Powers.',
            unl: () => { return true },
            cost: () => E(8),
        },
        23: {
            desc: 'Increase starting multipler base. x1.125 -> x1.150',
            unl: () => { return true },
            cost: () => E(13),
        },
        33: {
            desc: 'Planck Lengths boost Generators.',
            unl: () => { return true },
            cost: () => E(21),
            cur: () => { return player.money.add(1).pow(0.1).add(1).log10() },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        43: {
            desc: 'Sacrifice scales better and enable Sacrifice.',
            unl: () => { return true },
            cost: () => E(34),
        },
    },
}

const CHALLENGE = {
    pAreas: {
        reqtoUnl: [E('0'),E('e9000'),E('e20000'),E('e66000'),E(Infinity)],
        row: 2,
        col: 2,
        11: {
            unl: () => { return player.pAreas.times.gte(1) },
            desc: 'Length Generators is divided based on Planck Lengths.',
            goal: E(1e200),
            reward: 'Planck Lengths boost Length Generators.',
            cur: () => { return player.money.add(1).log10().add(1) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        12: {
            unl: () => { return player.money.gte('e9000') },
            desc: "Length Generatiors & Multiplers Tiers cost formula are higher. [1,3,6,...] -> [1,4,10,...]",
            goal: E('e2000'),
            reward: 'Length Generators are 2.25x effective.',
        },
        21: {
            unl: () => { return player.money.gte('e20000') },
            desc: "You can't buy Multiplers, but Meta Powers boost Length Generators.",
            goal: E('e5200'),
            reward: 'Meta Powers are 2x effective.',
        },
        22: {
            unl: () => { return player.money.gte('e66000') },
            desc: "There's only 6 Length Generators.",
            goal: E('e925'),
            reward: 'Length Generator 7 & 8 are 10x more effective.',
        },
    },
}

const ACHIEVEMENTS = {
    unls: {
        row: 10,
        col: 3,
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
            desc: 'Transform PL 10 resets.',
            req: () => { return player.pAreas.times.gte(10) },
        },
        27: {
            title: "I didn't need Meta Powers!",
            desc: 'Transform PL without having Meta Powers. Reward: Meta Effect is 25% stronger.',
            req: () => { return false },
        },
        28: {
            title: "8 have two ZEROS",
            desc: 'Transform PL without having Generators 8. Reward: Generators 8 are 50% stronger.',
            req: () => { return false },
        },
        29: {
            title: "Why you need NO POWERS to pass?",
            desc: 'Complete PA Challenge 3 without having Multiplers, Metas and Sacrifices. Reward: All Generators are less stronger based on Meta Powers.',
            req: () => { return false },
        },
        30: {
            title: 'Cubed Googol',
            desc: 'Reach 1e300 Planck Lengths. Reward: Generators is 10% stronger.',
            req: () => { return player.money.gte(1e300) },
        },
        31: {
            title: 'ÜBER Multiplers',
            desc: 'Reach Multipler Tier 10. Reward: Multiplers are 5% stronger.',
            req: () => { return player.multTiers.gte(10) },
        },
        32: {
            title: 'YAY! Challenge',
            desc: 'Complete first PA Challenge.',
            req: () => { return player.PA_chal.completed.length > 0 },
        },
        33: {
            title: 'New Era Generators',
            desc: 'Gain 10000 PA Powers.',
            req: () => { return player.PA_powers.gte('1e4') },
        },
        34: {
            title: 'Placeholder',
            desc: 'Placeholder.',
            img: true,
            req: () => { return false },
        },
        35: {
            title: 'Placeholder',
            desc: 'Placeholder.',
            img: true,
            req: () => { return false },
        },
        36: {
            title: 'Placeholder',
            desc: 'Placeholder.',
            img: true,
            req: () => { return false },
        },
        37: {
            title: 'Placeholder',
            desc: 'Placeholder.',
            img: true,
            req: () => { return false },
        },
        38: {
            title: 'Placeholder',
            desc: 'Placeholder.',
            img: true,
            req: () => { return false },
        },
        39: {
            title: 'Placeholder',
            desc: 'Placeholder.',
            img: true,
            req: () => { return false },
        },
        40: {
            title: 'Googoltoll!',
            desc: 'Reach 1e10000 Planck Lengths. Reward: Generators is 25% stronger.',
            req: () => { return player.money.gte('e10000') },
        },
    },
    secrets: {

    },
}

function buyPAGenerator(x, y, z) {
    let cost = FORMULA.pa_generator.cost(x, y, z)
    if (player.pAreas.points.gte(cost)) {
        player.pAreas.points = player.pAreas.points.sub(cost)
        player.PA_generators[x][0] = player.PA_generators[x][0].add(1)
        player.PA_generators[x][1] = player.PA_generators[x][1].add(1)
    }
}

function tierPAGenerator(x) {
    if (player.PA_generators[x][1].gte(100)) {
        player.PA_generators[x][1] = E(0)
        player.PA_generators[x][2] = player.PA_generators[x][2].add(1)
    }
}

function unlPAGenerator() {
    if (player.money.gte(UNL_PA_GEN[player.PA_gen_unls])) {
        player.PA_gen_unls++
    }
}

function buyPAmult() {
    let cost = FORMULA.pa_mult.cost()
    if (player.pAreas.points.gte(cost)) {
        player.pAreas.points = player.pAreas.points.sub(cost)
        player.PA_mult = player.PA_mult.add(1)
    }
}

function unlockPAChal(id) {
    if (!player.PA_chal.unl.includes(id)) player.PA_chal.unl.push(id)
}

function PAChal(id) {
    if (player.PA_chal.active == 0) {
        PLReset()
        player.PA_chal.active = id
    } else if (player.PA_chal.active == id) {
        if (player.money.gte(CHALLENGE.pAreas[id].goal) & !player.PA_chal.completed.includes(id)) {
            player.PA_chal.completed.push(id)
        }
        if (id == 21 && player.mults.lte(0) && player.metas.lte(0) && player.sacrifice.lte(1)) unlockAchievement(29)
        PLReset()
        player.PA_chal.active = 0
    }
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
        player.metas = player.metas.add(player.pAreas.upgs.includes(13)?FORMULA.meta_bulk():1)
        player.money = E(player.achievements.includes(25)?200:10)
        player.generators = []
        for (let i = 0; i < 8; i++) player.generators.push([E(0),E(0),E(1)])
        player.mults = E(0)
        player.multTiers = E(1)
        unlockFeature('sacrifice')
        player.sacrifice = E(1)
    }
}

function bulkGen(x) {
    if (FORMULA.generator_bulk(x,player.money,player.generators[x][2]).gt(player.generators[x][1])) {
        player.generators[x][0] = player.generators[x][0].add(FORMULA.generator_bulk(x,player.money,player.generators[x][2]).sub(player.generators[x][1]))
        player.generators[x][1] = FORMULA.generator_bulk(x,player.money,player.generators[x][2])
        player.money = player.money.sub(FORMULA.generator_cost(x,FORMULA.generator_bulk(x,player.money,player.generators[x][2]).sub(player.generators[x][2].sub(1).mul(100).max(1)),player.generators[x][2]))
    }
}

function bulkMult() {
    if (FORMULA.mult_bulk(player.money).gt(player.mults)) {
        player.mults = FORMULA.mult_bulk(player.money)
        player.money = player.money.sub(FORMULA.mult_cost(FORMULA.mult_bulk(player.money).sub(1)))
    }
}

function buyMax() {
    bulkMult()
    for (let i = 0; i < 8; i++) {
        bulkGen(i)
    }
}

function sacrificeGen() {
    if ((player.metas.gte(1) || player.pAreas.upgs.includes(43)) && FORMULA.gen8_have().gte(1)) {
        player.sacrifice = player.sacrifice.mul(FORMULA.sacrifice())
        for (let i = 0; i < 7; i++) player.generators[i][0] = E(0)
    }
}

function transformPL() {
    if (FORMULA.planckAreas_gain().gte(1)) {
        player.pAreas.points = player.pAreas.points.add(FORMULA.planckAreas_gain())
        player.pAreas.times = player.pAreas.times.add(1)
        if (player.metas.lte(0)) unlockAchievement(27)
        if (FORMULA.gen8_have().lte(0)) unlockAchievement(28)
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