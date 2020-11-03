var diff = 0;
var date = Date.now();

var player;

var chalText = (c, r) => { return (player.PA_chal.active == c*10+r)?(player.money.gte(CHALLENGE.pAreas[c*10+r].goal)?"Finish":'Exit'):(player.PA_chal.completed.includes(c*10+r)?'Finished':'Start') }

const EXP_COST = [E(2),E(3),E(5),E(8),E(12),E(18),E(25),E(36)]
const UNL_PA_GEN = [E('e101500'),E('e108000'),E('e130000'),E('e340000'),E('e850000'),E('e1500000'),E('e2500000'),E('e4000000'),E(Infinity)]

const TABS = ['Generators','Achievements','Options','Planck Area','Planck Volume']

const STABS = {
    'Planck Area': ['Upgrades', 'Autobuyers', 'Challenges','Post-Generators','Areaity'],
    'Generators': ['Length Generators','Area Generators','Volume Generators'],
    'Planck Volume': ['Volume studies', 'Volume upgrades', 'Volume milestones', 'Volume challenges'],
}

const TABS_UNLS = {
    'Generators': () => { return true },
    'Achievements': () => { return true },
    'Options': () => { return true },
    'Planck Area': () => { return player.unls.includes('planckAreas') },
    'Planck Volume': () => { return player.unls.includes('planckVolumes') },
}

const STABS_UNLS = {
    'Planck Area': {
        'Upgrades': () => { return true },
        'Autobuyers': () => { return player.pAreas.times.gte(5) },
        'Challenges': () => { return true },
        'Post-Generators': () => { return player.unls.includes('PA_Generators') },
        'Areaity': () => { return player.studies.upgs.includes(21) },
    },
    'Generators': {
        'Length Generators': () => { return true },
        'Area Generators': () => { return player.unls.includes('PA_Generators') },
        'Volume Generators': () => { return player.unls.includes('planckVolumes') },
    },
    'Planck Volume': {
        'Volume studies': () => { return true },
        'Volume upgrades': () => { return true },
        'Volume milestones': () => { return true },
        'Volume challenges': () => { return true },
    }
}

const FUNCTIONS = {
    0: (x) => {
        let fy = (player.PA_chal.active == 12 || player.PA_chal.active == 31)?E(x).mul(E(x).add(1)).mul(E(x).add(2)).div(6):E(x).pow(2).add(x).div(2)
        if (player.PA_chal.active == 42) fy = fy.pow(2)
        return fy
    },
}

const FORMULA = {
    generator_cost: (x, y, z) => {
        if ((player.PA_chal.active == 22 || player.PA_chal.active == 31) && (x == 6 || x == 7)) return Infinity
        if (z.gte(100)) return Infinity
        return y.lt(100)?E(10).pow(EXP_COST[x].mul(FUNCTIONS[0](z.add(player.gen_tetr[x].sub(1).mul(100)).mul(FUNCTIONS[0](player.gen_tetr[x])))).mul(y.add(1).add(z.sub(1).mul(100)).add(player.gen_tetr[x].sub(1).mul(10000))).sub(1)):Infinity
    },
    generator_boost: (x, y, z) => { return E(y.add(player.gen_tetr[z].sub(1).mul(100)).add(player.pAreas.upgs.includes(12)?1.5:1)
        .mul(player.achievements.includes(19)?1.05:1)
        .mul(player.achievements.includes(20)?1.05:1)
        .mul((player.achievements.includes(28) && z == 7)?1.5:1)
        .mul(player.achievements.includes(29)?player.metas.add(1).log10().add(1):1)
        .mul(player.achievements.includes(30)?1.1:1)
        .mul(player.achievements.includes(40)?1.25:1)
        .mul(player.achievements.includes(50)?1.25:1)
        .mul(player.PA_chal.completed.includes(12)?2.25:1)
        .mul((player.PA_chal.completed.includes(22)&(z == 6 || z == 7))?10:1))
        .pow(x.add(y.sub(1).mul(100)).add(player.gen_tetr[z].sub(1).mul(10000)))
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
        .mul((z < 7)?(player.studies.upgs.includes(61)?STUDIES[61].cur():1):1)
        .mul(player.studies.upgs.includes(82)?STUDIES[82].cur():1)
        .mul(player.studies.upgs.includes(111)?'e200000':1)
        .mul(FORMULA.pa_powers_eff())
        .pow((player.PA_chal.active == 21 || player.PA_chal.active == 31)?FORMULA.meta_boost().pow(1/2):1)
        .pow((player.PA_chal.active == 41)?(1/player.mults.add(player.multTiers.sub(1).mul(100)).add(player.multTetrs.sub(1).mul(10000)).add(1).log10().add(1)):1)
        .pow(player.PA_chal.completed.includes(41)?1.15:1)
        .pow(player.gen_tetr[z])
        .div((player.PA_chal.active == 11 || player.PA_chal.active == 31)?player.money.add(1).pow(0.1):1)
    },
    generator_bulk: (x, y, z) => {
        if ((player.PA_chal.active == 22 || player.PA_chal.active == 31) && (x == 6 || x == 7)) return E(0)
        if (z.gte(100)) return E(0)
        return E(y).log10().add(1).div(EXP_COST[x]).div(FUNCTIONS[0](z.add(player.gen_tetr[x].sub(1).mul(100)).mul(FUNCTIONS[0](player.gen_tetr[x])))).sub(z.sub(1).mul(100)).sub(player.gen_tetr[x].sub(1).mul(10000)).floor().max(0).min(100)
    },
    gps: (x) => { return player.generators[x][0].mul(FORMULA.generator_boost(player.generators[x][1], player.generators[x][2], x)) },
    mult_cost: (x) => {
        if (player.multTiers.gte(100)) return E(Infinity)
        return (x.lt(100))?((player.PA_chal.active == 21 || player.PA_chal.active == 31)?Infinity:E(10).pow(E(x).add(player.multTiers.sub(1).mul(100)).add(player.multTetrs.sub(1).mul(10000)).mul(FUNCTIONS[0](player.multTiers.add(player.multTetrs.sub(1).mul(100)).mul(FUNCTIONS[0](player.multTetrs)))).add(3))):Infinity
    },
    mult_boost: () => { return E(FORMULA.mult_base()).pow(player.mults.add(player.multTiers.sub(1).mul(100)).add(player.multTetrs.sub(1).mul(10000)).add(FORMULA.pv_powers_eff.mults_gain())) },
    mult_base: () => {
        let base = E(player.pAreas.upgs.includes(23)?1.15:1.125)
        if (player.studies.upgs.includes(71)) base = E(1.25)
        if (player.PA_chal.active == 32) base = E(1.001)
        return base.mul(player.PA_chal.completed.includes(32)?CHALLENGE.pAreas[32].cur():1)
        .pow(FORMULA.meta_boost().mul(player.multTiers.add(player.multTetrs.sub(1).mul(100)))
        .mul(player.multTetrs)
        .mul(player.achievements.includes(23)?1.02:1)
        .mul(player.achievements.includes(31)?1.05:1)
        .mul(player.achievements.includes(55)?1.10:1)
        .mul(player.studies.upgs.includes(73)?STUDIES[73].cur():1))
        .pow((player.volume_chal.active == 21)?0.01:1)
    },
    mult_bulk: (x) => {
        if (player.multTiers.gte(100)) return E(0)
        return (player.PA_chal.active == 21 || player.PA_chal.active == 31)?E(0):E(x).log10().sub(3).div(FUNCTIONS[0](player.multTiers.add(player.multTetrs.sub(1).mul(100)).mul(FUNCTIONS[0](player.multTetrs)))).sub(player.multTiers.sub(1).mul(100)).sub(player.multTetrs.sub(1).mul(10000)).add(1).floor().max(0).min(100) },
    meta_tier_cost: () => {
        let mult = 1
        if (player.studies.upgs.includes(32)) mult = 0.5
        return mult
    },
    meta_cost: () => {
        return (player.metas < 100)?FORMULA.meta_have().mul(2).mul(FUNCTIONS[0](player.metaTiers.sub(1).mul(FORMULA.meta_tier_cost())).floor().add(1)).add(1).floor():E(Infinity)
    },
    meta_boost: () => { return FORMULA.meta_have().add(player.areaity.metas * (player.studies.upgs.includes(153)?1.5:1))
        .mul(player.metaTiers)
        .mul(player.achievements.includes(24)?1.1:1)
        .mul(player.achievements.includes(27)?1.25:1)
        .mul(player.pAreas.upgs.includes(42)?2:1)
        .mul(player.PA_chal.completed.includes(21)?2:1)
        .add(1).pow(1/3)
        .mul(CHALLENGE.pVolumes[21].cur())
    },
    meta_bulk: () => {
        return FORMULA.gen8_have().sub(player.metaTiers.sub(1).mul(200)
        .mul(FUNCTIONS[0](player.metaTiers.sub(1).mul(FORMULA.meta_tier_cost())).floor().add(1)))
        .add(E(2).mul(FUNCTIONS[0](player.metaTiers.sub(1).mul(FORMULA.meta_tier_cost())).floor().add(1)).sub(1)).div(2)
        .div(FUNCTIONS[0](player.metaTiers.sub(1).mul(FORMULA.meta_tier_cost())).floor().add(1)).floor().min(100)
    },
    meta_have: () => { return player.metas.add(player.metaTiers.sub(1).mul(100)) },
    gen8_have: () => { return player.generators[7][1].add(player.generators[7][2].sub(1).mul(100)).add(player.gen_tetr[7].sub(1).mul(9900)) },
    sacrifice: () => {
        let mul = player.money.add(1)
        if (player.pAreas.upgs.includes(43)) mul = mul.pow(1/10)
        else mul = mul.logBase(10)
        return mul.add(1).pow(player.achievements.includes(35)?1.25:1).div(player.sacrifice).mul(2).max(1)
    },
    planckAreas_gain: () => {
        let formula = player.money.add(1).log10().div(100).sub(2).pow(1/2)
        if (player.PG_upgs.includes(22)) formula = player.money.add(1).pow(1/300).add(1).log10()
        if (player.studies.upgs.includes(91)) formula = player.money.add(1).pow(1/300).add(1).logBase(5).pow(2)
        return formula
        .mul(FORMULA.pa_mult.boost())
        .mul(player.PG_upgs.includes(13)?UPGRADE.post_gens[13].cur():1)
        .mul(player.PG_upgs.includes(33)?UPGRADE.post_gens[33].cur():1)
        .mul(player.studies.upgs.includes(31)?STUDIES[31].cur():1)
        .mul(player.studies.upgs.includes(42)?1e6:1)
        .mul(player.studies.upgs.includes(151)?STUDIES[151].cur():1)
        .pow(player.PG_upgs.includes(41)?1.03:1)
        .pow(player.achievements.includes(51)?1.1:1)
        .floor().max(0)
    },
    pa_stat_gain: () => {
        return E(player.PG_upgs.includes(32)?UPGRADE.post_gens[32].cur():1)
        .mul(player.studies.upgs.includes(22)?STUDIES[22].cur():1)
    },
    planckVolumes_gain: () => {
        if (player.pAreas.points.add(1).log10().lt(36)) return E(0)
        return E(10).pow(player.pAreas.points.add(1).log10().div(36).sub(1))
        .mul(player.studies.upgs.includes(51)?7:1)
        .mul(FORMULA.pv_mult.boost())
        .floor()
    },
    pa_mult: {
        cost: (x) => { return E(4).pow(x).mul(10) },
        boost: () => { return E(player.achievements.includes(39)?2.5:2).pow(player.PA_mult) },
        bulk: () => {
            if (player.pAreas.points.lt(10)) return E(0)
            return player.pAreas.points.add(1).div(10).logBase(4).add(1).floor().max(0)
        }, 
    },
    pv_mult: {
        cost: (x) => { return E(10).pow(x.add(1)) },
        boost: () => { return E(5).pow(player.PV_mult) },
        bulk: () => {
            return player.pVolumes.points.max(1).log10().floor().max(0)
        },
        buy: () => {
            let cost = FORMULA.pv_mult.cost(player.PV_mult)
            if (player.pVolumes.points.gte(cost)) {
                player.pVolumes.points = player.pVolumes.points.sub(cost)
                player.PV_mult = player.PV_mult.add(1)
            }
        }
    },
    pa_generator: {
        ps: (x) => { return player.PA_generators[x][0].mul(FORMULA.pa_generator.boost(player.PA_generators[x][1], player.PA_generators[x][2], x)) },
        cost: (x, y, z) => { return y.lt(100)?E(10).pow(EXP_COST[x].mul(FUNCTIONS[0](z)).mul(y.add(1).add(z.sub(1).mul(100))).sub(1)):Infinity },
        boost: (x, y, z) => { return E(E(player.PG_upgs.includes(23)?20:2).mul(y)
            .mul(player.achievements.includes(50)?1.25:1))
            .pow(x.add(y.sub(1).mul(100)))
            .mul(player.PG_upgs.includes(12)?UPGRADE.post_gens[12].cur():1)
            .mul(player.PA_chal.completed.includes(31)?CHALLENGE.pAreas[31].cur():1)
            .mul(player.areaity.unl?FORMULA.areaity.effect():1)
            .mul(player.pVolumes.upgs.includes(11)?UPGRADE.pVolumes[11].cur():1)
            .mul(player.pVolumes.upgs.includes(12)?UPGRADE.pVolumes[12].cur():1)
            .mul((z == 0)?(CHALLENGE.pVolumes[12].cur()[0]):1)
            .mul((z == 3)?(player.studies.upgs.includes(62)?STUDIES[62].cur():1):1)
            .mul(player.studies.upgs.includes(72)?STUDIES[72].cur():1)
            .mul(player.studies.upgs.includes(112)?1e50:1)
        },
        bulk: (x, y, z) => { return E(y).log10().add(1).div(EXP_COST[x]).div(FUNCTIONS[0](z)).sub(z.sub(1).mul(100)).floor().max(0).min(100) },
    },
    pa_powers_eff: () => {
        if (player.volume_chal.active == 12) return E(1)
        return player.PA_powers.add(1).pow(100).pow(player.PG_upgs.includes(21)?UPGRADE.post_gens[21].cur():1).pow(CHALLENGE.pVolumes[12].cur()[1]).pow(player.studies.upgs.includes(152)?STUDIES[152].cur():1)
    },
    pv_generator: {
        ps: (x) => { return player.PV_generators[x][0].mul(FORMULA.pv_generator.boost(player.PV_generators[x][1], player.PV_generators[x][2], x)) },
        cost: (x, y, z) => { return y.lt(100)?E(10).pow(VOL_GEN_COST[x].mul(FUNCTIONS[0](z)).mul(y.add(1).add(z.sub(1).mul(100))).sub(1)):Infinity },
        boost: (x, y, z) => {
            return E(E(4).mul(y)).pow(x.add(y.sub(1).mul(100)))
            .mul((z == 0)?(player.studies.upgs.includes(11)?STUDIES[11].cur():1):1)
            .mul(player.studies.upgs.includes(63)?STUDIES[63].cur():1)
            .mul(player.studies.upgs.includes(83)?STUDIES[83].cur():1)
            .mul(player.studies.upgs.includes(101)?1e3:1)
            .mul(player.pVolumes.upgs.includes(21)?UPGRADE.pVolumes[21].cur():1)
            .mul(player.pVolumes.upgs.includes(22)?UPGRADE.pVolumes[22].cur():1)
            .mul(CHALLENGE.pVolumes[11].cur())
        },
        bulk: (x, y, z) => { return E(y).log10().add(1).div(VOL_GEN_COST[x]).div(FUNCTIONS[0](z)).sub(z.sub(1).mul(100)).floor().max(0).min(100) },
    },
    pv_powers_eff: {
        req_base: () => { return player.studies.upgs.includes(121)?(11/9):(4/3) },
        mults_gain: () => {
            if (player.volume_chal.active == 11) return E(0)
            return player.PV_powers.div(10).logBase(FORMULA.pv_powers_eff.req_base()).max(0).floor()
        },
        next_mults: () => { return E(FORMULA.pv_powers_eff.req_base()).pow(FORMULA.pv_powers_eff.mults_gain().add(1)).mul(10).floor() },
    },
    studies: {
        have: () => { return E(player.studies.total).sub(player.studies.spent) },
        1: {
            cost: (x) => { return E(10).pow(E(x+1).pow(2.25).mul(1e4)) },
            value: () => { return player.money },
            costDesc: 'PL',
            buy: () => {
                let cost = FORMULA.studies[1].cost(player.studies.gain_vt[0])
                if (player.money.gte(cost)) {
                    player.money = player.money.sub(cost)
                    player.studies.gain_vt[0]++
                    player.studies.total++
                }
            },
            max: () => {
                let bulk = player.money.add(1).log10().div(1e4).pow(1/2.25).floor().toNumber()
                if (player.studies.gain_vt[0] < bulk) {
                    player.studies.total += bulk - player.studies.gain_vt[0]
                    player.studies.gain_vt[0] = bulk
                    player.money = player.money.sub(FORMULA.studies[1].cost(bulk-1))
                }
            },
        },
        2: {
            cost: (x) => { return E(10).pow(E(x).mul(10)) },
            value: () => { return player.pAreas.points },
            costDesc: 'PA',
            buy: () => {
                let cost = FORMULA.studies[2].cost(player.studies.gain_vt[1])
                if (player.pAreas.points.gte(cost)) {
                    player.pAreas.points = player.pAreas.points.sub(cost)
                    player.studies.gain_vt[1]++
                    player.studies.total++
                }
            },
            max: () => {
                let bulk = player.pAreas.points.add(1).log10().div(10).floor().toNumber()
                if (player.pAreas.points.gte(1)) bulk = player.pAreas.points.add(1).log10().div(10).add(1).floor().toNumber()
                if (player.studies.gain_vt[1] < bulk) {
                    player.studies.total += bulk - player.studies.gain_vt[1]
                    player.studies.gain_vt[1] = bulk
                    player.pAreas.points = player.pAreas.points.sub(FORMULA.studies[2].cost(bulk-1))
                }
            },
        },
        3: {
            cost: (x) => { return E(2).pow(x) },
            value: () => { return player.pVolumes.points },
            costDesc: 'PV',
            buy: () => {
                let cost = FORMULA.studies[3].cost(player.studies.gain_vt[2])
                if (player.PV_generators[0][1].gte(1)) {
                    if (player.pVolumes.points.gte(cost)) {
                        player.pVolumes.points = player.pVolumes.points.sub(cost)
                        player.studies.gain_vt[2]++
                        player.studies.total++
                    }
                } else alert('Buy Volume Generator 1 first!')
            },
            max: () => {
                let bulk = player.pVolumes.points.add(1).logBase(2).floor().toNumber()
                if (player.pVolumes.points.gte(1)) bulk++
                if (player.PV_generators[0][1].gte(1)) {
                    if (player.studies.gain_vt[2] < bulk) {
                        player.studies.total += bulk - player.studies.gain_vt[2]
                        player.studies.gain_vt[2] = bulk
                        player.pVolumes.points = player.pVolumes.points.sub(FORMULA.studies[3].cost(bulk-1))
                    }
                } else alert('Buy Volume Generator 1 first!')
            },
        },
    },
    areaity: {
        ps: () => { return FORMULA.areaity.upgs[1].cur()
            .mul(player.studies.upgs.includes(81)?STUDIES[81].cur():1)
            .pow(FORMULA.areaity.upgs[2].cur())
            .pow(player.achievements.includes(43)?1.5:1)
            .pow(player.achievements.includes(52)?2:1)
            .div(FORMULA.areaity.penality()).max(1)
        },
        meta_gain: () => { return player.areaity.powers.add(1).log10().div(E('1.79e308').log10()).floor() },
        penality: () => {
            if (player.areaity.powers.lt('1.79e308')) return E(1)
            return E(3).pow(player.areaity.powers.add(1).log10().div(E('1.79e308').log10()).sub(1))
        },
        wait: () => { return E('1.79e308').log10().sub(player.areaity.powers.add(1).log10()).div(FORMULA.areaity.ps().log10()).max(0) },
        effect: () => {
            let num = player.areaity.powers.add(1)
            if (player.studies.upgs.includes(44)) num = num.pow(0.035)
            else num = num.logBase(2).add(1).pow(2)
            return num
        },
        upgs: {
            1: {
                desc: 'Increase multiplier of Areaity gain.',
                cost: (x) => { return E(10).pow(E(35).add(E(5).mul(x))) },
                bulk: () => {
                    let bulk = player.pAreas.points.add(1).log10().sub(35).div(5).floor()
                    if (player.pAreas.points.gte('e35')) return bulk.add(1)
                    return bulk
                },
                cur: () => { return E(1).add(E(player.areaity.upgs[0]).div(2)) },
                curDesc: (x) => { return 'x'+notate(x,1) },
            },
            2: {
                desc: 'Increase power of Areaity gain.',
                cost: (x) => { return E(10).pow(E(45).add(E(15).mul(x))) },
                bulk: () => {
                    let bulk = player.pAreas.points.add(1).log10().sub(45).div(15).floor()
                    if (player.pAreas.points.gte('e45')) return bulk.add(1)
                    return bulk
                },
                cur: () => { return E(1).add(E(player.areaity.upgs[1]).div(5)) },
                curDesc: (x) => { return '^'+notate(x,1) },
            },
            3: {
                desc: 'Increase max Areaity Metas.',
                cost: (x) => { return E(10).pow(E(40).add(E(10).mul(x))) },
                bulk: () => {
                    let bulk = player.pAreas.points.add(1).log10().sub(40).div(10).floor()
                    if (player.pAreas.points.gte('e40')) return bulk.add(1)
                    return bulk
                },
                cur: () => { return E(player.areaity.upgs[2]+1) },
                curDesc: (x) => { return notate(x,0)+' Metas' },
            },
            buy: (x) => {
                let cost = FORMULA.areaity.upgs[x].cost(player.areaity.upgs[x-1])
                if (player.pAreas.points.gte(cost)) {
                    player.pAreas.points = player.pAreas.points.sub(cost)
                    player.areaity.upgs[x-1]++
                }
            },
            max: (x) => {
                let bulk = FORMULA.areaity.upgs[x].bulk().toNumber()
                if (bulk > player.areaity.upgs[x-1]) {
                    player.areaity.upgs[x-1] = bulk
                    player.pAreas.points = player.pAreas.points.sub(FORMULA.areaity.upgs[x].cost(bulk-1))
                }
            }
        },
    },
    v_chal_text: (x) => {
        if (player.volume_chal.enabled != x) return (FORMULA.v_chal_times(x) < 5)?'Locked':'Finished'
        if (player.volume_chal.active != x) return 'Start'
        if (player.pAreas.points.gte(CHALLENGE.pVolumes[x].goal())) return 'Finish'
        return 'Exit'
    },
    v_chal_times: (x) => {
        if (player.volume_chal.completed[x]) return player.volume_chal.completed[x]
        return 0
    }
}

const UPGRADE = {
    pAreas: {
        row: 3,
        col: 4,
        11: {
            desc: 'Generators gain a multiplier based on time played.',
            unl: () => { return true },
            cost: () => E(1),
            cur: () => {
                if (player.PG_upgs.includes(11)) return E(1.0001).pow(E(player.ticks).add(1)).add(1)
                return E(player.ticks).add(1).log10().max(1)
            },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        12: {
            desc: 'Increase the starting multiplier per buying Generators. x2 -> x2.5',
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
            cur: () => { return player.pAreas.points.add(1).pow(2).pow(player.PG_upgs.includes(31)?UPGRADE.post_gens[31].cur():1) },
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
            desc: 'Increase starting multiplier base. x1.125 -> x1.150',
            unl: () => { return true },
            cost: () => E(13),
        },
        33: {
            desc: 'Planck Lengths boost Generators.',
            unl: () => { return true },
            cost: () => E(21),
            cur: () => { return player.money.add(1).pow(0.1).add(1).log10().add(1) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        43: {
            desc: 'Sacrifice scales better and enable Sacrifice.',
            unl: () => { return true },
            cost: () => E(34),
        },
    },
    post_gens: {
        row: 3,
        col: 4,
        11: {
            desc: 'PA Upgrade 1 formula is better.',
            unl: () => { return true },
            cost: () => E(1e3),
        },
        12: {
            desc: 'PA times boost Area Generators.',
            unl: () => { return true },
            cost: () => E(1e4),
            cur: () => { return player.pAreas.times.mul(0.2).add(1) },
            curDesc: (x) => { return 'x'+notate(x,1) },
        },
        13: {
            desc: 'Planck Areas gain based on Planck Lengths.',
            unl: () => { return true },
            cost: () => E(25000),
            cur: () => { return player.money.add(1).log10().add(1).pow(1/5) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        21: {
            desc: 'PA Powers Effect is stronger based on Planck Lengths.',
            unl: () => { return true },
            cost: () => E(5e6),
            cur: () => { return player.money.add(1).log10().add(1).log(10).add(1).logBase(5).add(1) },
            curDesc: (x) => { return '^'+notate(x) },
        },
        22: {
            desc: 'Planck Areas gain formula is better.',
            unl: () => { return true },
            cost: () => E(1e8),
        },
        23: {
            desc: 'Increase starting multiplier per buying Area Generators. x2 -> x20',
            unl: () => { return true },
            cost: () => E(1e9),
        },
        31: {
            desc: 'Planck Areas upgrade 4:1 effect is stronger based on PA resets.',
            unl: () => { return true },
            cost: () => E('1e13'),
            cur: () => { return player.pAreas.times.add(1).log10().add(1).mul(5) },
            curDesc: (x) => { return '^'+notate(x) },
        },
        32: {
            desc: 'You can get more PA resets only from transforming PL.',
            unl: () => { return true },
            cost: () => E('1e14'),
            cur: () => { return FORMULA.planckAreas_gain().pow(1/4).floor() },
            curDesc: (x) => { return '+'+notate(x,0) },
        },
        33: {
            desc: 'PA times boost Planck Areas gain.',
            unl: () => { return true },
            cost: () => E('1e15'),
            cur: () => { return player.pAreas.times.add(1).pow(3/5) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        41: {
            desc: 'Raise Planck Areas gain by 1.03.',
            unl: () => { return true },
            cost: () => E(1e33),
        },
        42: {
            desc: 'Placeholder.',
            unl: () => { return false },
            cost: () => E(1/0),
        },
        43: {
            desc: 'Placeholder.',
            unl: () => { return false },
            cost: () => E(1/0),
        },
    },
    pVolumes: {
        row: 2,
        col: 2,
        11: {
            desc: 'Area Generators is multipled based on unspent PV.',
            unl: () => { return true },
            cost: () => E(5),
            cur: () => { return player.pVolumes.points.add(1).pow(1.5) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        12: {
            desc: 'Area Generators is multipled based on PV stat.',
            unl: () => { return true },
            cost: () => E(15),
            cur: () => { return player.pVolumes.times.add(1).div(50).add(1).pow(player.pVolumes.times.mul(2).add(1).logBase(4).add(1)).add(1).pow(2) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        21: {
            desc: 'Volume Generators is multipled based on total Volume Studies.',
            unl: () => { return true },
            cost: () => E(5e5),
            cur: () => { return E(player.studies.total+1).pow(2) },
            curDesc: (x) => { return notate(x)+'x' },
        },
        22: {
            desc: 'Volume Generators is multipled based on time played.',
            unl: () => { return true },
            cost: () => E(5e7),
            cur: () => { return E(player.ticks+1).pow(0.45) },
            curDesc: (x) => { return notate(x)+'x' },
        },
    },
}

const CHALLENGE = {
    pAreas: {
        reqtoUnl: [E('e300'),E('e9000'),E('e48000'),E('e88000'),E('e101500'),E('e130000'),E('e203000'),E(Infinity)],
        row: 2,
        col: 4,
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
            desc: "Length Generatiors, Multipliers & Metas Tiers cost formula are higher. [1,3,6,...] -> [1,4,10,...]",
            goal: E('e2000'),
            reward: 'Length Generators are 2.25x effective.',
        },
        21: {
            unl: () => { return player.money.gte('e48000') },
            desc: "You can't buy Multipliers, but Meta Powers boost Length Generators.",
            goal: E('e5300'),
            reward: 'Meta Powers are 2x effective.',
        },
        22: {
            unl: () => { return player.money.gte('e88000') },
            desc: "There's only 6 Length Generators.",
            goal: E('e925'),
            reward: 'Length Generator 7 & 8 are 10x more effective.',
        },
        31: {
            unl: () => { return player.money.gte('e101500') },
            desc: "1-4 PA Challenges are applied at once.",
            goal: E('e4500'),
            reward: 'Gain Area Generators based on PA Challenges completed.',
            cur: () => { return E(1.3).pow(player.PA_chal.completed.length) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        32: {
            unl: () => { return player.money.gte('e130000') },
            desc: "There's only x1.001 multiplier base.",
            goal: E('e21500'),
            reward: 'Multiplier Base are stronger based on Meta Powers have.',
            cur: () => { return FORMULA.meta_have().add(1).log10().add(1).div(100).add(1) },
            curDesc: (x) => { return notate(x.sub(1).mul(100))+'%' },
        },
        41: {
            unl: () => { return player.money.gte('e203000') },
            desc: "Lower raise Length Generators based on Multiplier Powers have.",
            goal: E('e27000'),
            reward: 'Raise Length Generators by 1.15.',
        },
        42: {
            unl: () => { return player.money.gte(1/0) },
            desc: "Length Generatiors, Multipliers & Metas Tiers cost formula are raised by 2.",
            goal: E('e150000'),
            reward: 'Length Generator 7 & 8 are 10x more effective.',
        },
    },
    pVolumes: {
        row: 2,
        col: 2,
        11: {
            desc: 'Volume Generators are disabled.',
            goal: () => { return E(10).pow(300+30*FORMULA.v_chal_times(11)) },
            reward: 'Volume Generators gain based on spent time played.',
            cur: () => { return E(player.ticks+1).pow(0.55*(FORMULA.v_chal_times(11)**0.5)) },
            curDesc: (x) => { return 'x'+notate(x) },
        },
        12: {
            desc: 'Area Generators are disabled.',
            goal: () => { return E(10).pow(300+30*FORMULA.v_chal_times(12)) },
            reward: 'PA powers boost Area generator 1, and raise PA powers effect.',
            cur: () => { return [player.PA_powers.add(1).pow(0.1*(FORMULA.v_chal_times(12)**0.5)), E((FORMULA.v_chal_times(12)+1)**3.25)] },
            curDesc: (x) => { return 'x'+notate(x[0],0)+' to Area generator 1, ^'+notate(x[1],1)+' to PA powers effect' },
        },
        21: {
            desc: 'Multiplier Powers are weaker.',
            goal: () => { return E(10).pow(300+30*FORMULA.v_chal_times(21)) },
            reward: 'Metas are stronger.',
            cur: () => { return E(FORMULA.v_chal_times(21)+1).pow(0.5) },
            curDesc: (x) => { return 'x'+notate(x,2) },
        },
        22: {
            desc: 'Placeholder.',
            goal: () => { return E(1/0) },
            reward: 'Placeholder.',
        },
    },
}

const ACHIEVEMENTS = {
    unls: {
        row: 10,
        col: 5,
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
            desc: 'Buy 9 Multiplier Powers. Reward: Generators is 5% stronger.',
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
            title: 'Upgrade Multiplier',
            desc: 'Tier Multipliers (if Multiplier Powers reached 100). Reward: Multiplier Base is 2% stronger.',
            req: () => { return player.multTiers.gte(2) },
        },
        24: {
            title: 'Upgrade Again',
            desc: 'Reach Multiplier Tier 3. Reward: Meta Effect is 10% stronger.',
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
            desc: 'Complete PA Challenge 3 without having Multipliers, Metas and Sacrifices. Reward: All Generators are stronger based on Meta Powers.',
            req: () => { return false },
        },
        30: {
            title: 'Cubed Googol',
            desc: 'Reach 1e300 Planck Lengths. Reward: Generators is 10% stronger.',
            req: () => { return player.money.gte(1e300) },
        },
        31: {
            title: 'ÜBER Multipliers',
            desc: 'Reach Multiplier Tier 10. Reward: Multipliers are 5% stronger.',
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
            title: 'HOW CAN YOU GET 1e1000x MULTIPLIER?!',
            desc: 'Reach 1e10 PA Powers.',
            req: () => { return player.PA_powers.gte('1e10') },
        },
        35: {
            title: 'Skip for Bigger Sacrifice',
            desc: 'Sacrifice 1e60000x or bigger at once. Reward: Raise sacrifice effect by 1.25.',
            req: () => { return false },
        },
        36: {
            title: 'New Features!',
            desc: 'Unlock Area generator 4.',
            req: () => { return player.PA_gen_unls > 3 },
        },
        37: {
            title: 'DO NEED META POWERS',
            desc: 'Reach Meta Tier 3.',
            req: () => { return player.metaTiers.gte(3) },
        },
        38: {
            title: 'Too Many Eight',
            desc: 'Get 1000 Length Generators 8.',
            img: true,
            req: () => { return FORMULA.gen8_have().gte(1000) },
        },
        39: {
            title: 'I didnt get money per seconds',
            desc: 'Transform PL for 1e9 PA in one run. Reward: Increase multiplier of upgrade to more PA. x2 -> x2.5',
            req: () => { return false },
        },
        40: {
            title: 'Googoltoll!',
            desc: 'Reach 1e10000 Planck Lengths. Reward: Generators is 25% stronger.',
            req: () => { return player.money.gte('e10000') },
        },
        41: {
            title: '(Planck Lengths)^3',
            desc: 'Transform Planck Areas. Reward: Start with 2e50 Planck Lengths.',
            img: true,
            req: () => { return player.pVolumes.times.gte(1) },
        },
        42: {
            title: '"Real"ity',
            desc: 'Unlock Areaity.',
            img: true,
            req: () => { return player.areaity.unl },
        },
        43: {
            title: 'Free 🅱etas',
            desc: 'Gain 2 areaity metas. Reward: Grow areaity powers 1.5 times faster.',
            img: true,
            req: () => { return player.areaity.metas >= 2 },
        },
        44: {
            title: 'Four Timepowers',
            desc: 'Buy Volume generator 4.',
            img: true,
            req: () => { return player.PV_generators[3][1].gte(1) },
        },
        45: {
            title: '1/2 of Tetr Up',
            desc: 'Reach Multipler Tier 50.',
            img: true,
            req: () => { return player.multTiers.gte(50) },
        },
        46: {
            title: 'Big Bigger Biggest',
            desc: 'Get e2,500,000x sacrifice multipler. Reward: Sacrifice dosent reset Length generators.',
            img: true,
            req: () => { return player.sacrifice.gte('e2500000') },
        },
        47: {
            title: 'Non-Infinity Hero',
            desc: 'Transform PA without having PA powers. Reward: Meta dosent reset Sacrifice.',
            img: true,
            req: () => { return false },
        },
        48: {
            title: 'Non-Flipped Infinity',
            desc: 'Buy Area Generator 8.',
            img: true,
            req: () => { return player.PA_generators[7][1].gte(1) },
        },
        49: {
            title: 'Area.exe has not exist',
            desc: 'Gain 9.999e99 PA.',
            img: true,
            req: () => { return player.pAreas.points.gte('9.999e99') },
        },
        50: {
            title: 'Micrillion PL in zoom!',
            desc: 'Reach e3,000,003 PL. Reward: Length & Area Generators is 25% stronger.',
            img: true,
            req: () => { return player.money.gte('e3000003') },
        },
        51: {
            title: 'Road of Reality',
            desc: 'Reach 16,000,000 PV. Reward: Raise PA gain by 1.1',
            img: true,
            req: () => { return player.pVolumes.points.gte('16000000') },
        },
        52: {
            title: 'Ten + Metas = Tetas',
            desc: 'Get 10 areaity metas. Reward: Grow areaity powers 2 times faster.',
            img: true,
            req: () => { return player.areaity.metas >= 10 },
        },
        53: {
            title: '1000 Multipliers like One Power',
            desc: 'Get 1000 multiplier upgrades.',
            img: true,
            req: () => { return FORMULA.pv_powers_eff.mults_gain().gte(1000) },
        },
        54: {
            title: 'Infinity Tier',
            desc: 'Reach 1st Area generator Tier 2.',
            img: true,
            req: () => { return player.PA_generators[0][2].gte(2) },
        },
        55: {
            title: 'New Era of Tetration',
            desc: 'Tetr Multiplier up. Reward: Multiplier are 10% stronger.',
            img: true,
            req: () => { return player.multTetrs.gte(2) },
        },
        56: {
            title: 'Not Easy Challenge',
            desc: 'Complete Volume challenge.',
            img: true,
            req: () => { return Object.keys(player.volume_chal.completed).length > 0 },
        },
        57: {
            title: 'I wanted to get infinity',
            desc: 'Get 1.79e308 Planck Areas.',
            img: true,
            req: () => { return player.pAreas.points.gte('1.79e308') },
        },
        58: {
            title: 'Placeholder',
            desc: 'Placeholder.',
            img: true,
            req: () => { return false },
        },
        59: {
            title: 'Placeholder',
            desc: 'Placeholder.',
            img: true,
            req: () => { return false },
        },
        60: {
            title: 'NANILLION!',
            desc: 'Reach e3e9 Planck Lengths.',
            img: true,
            req: () => { return player.money.gte('e3e9') },
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

function buyPVGenerator(x, y, z) {
    let cost = FORMULA.pv_generator.cost(x, y, z)
    if (player.pVolumes.points.gte(cost)) {
        player.pVolumes.points = player.pVolumes.points.sub(cost)
        player.PV_generators[x][0] = player.PV_generators[x][0].add(1)
        player.PV_generators[x][1] = player.PV_generators[x][1].add(1)
    }
}

function buyMaxVT() {
    for (let i = 1; i <= 3; i++) FORMULA.studies[i].max()
}

function tierPVGenerator(x) {
    if (player.PV_generators[x][1].gte(100)) {
        player.PV_generators[x][1] = E(0)
        player.PV_generators[x][2] = player.PV_generators[x][2].add(1)
    }
}

function unlPAGenerator() {
    if (player.money.gte(UNL_PA_GEN[player.PA_gen_unls])) {
        player.PA_gen_unls++
    }
}

function buyPAmult() {
    let cost = FORMULA.pa_mult.cost(player.PA_mult)
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
        if (player.money.gte(CHALLENGE.pAreas[id].goal)) {
            if (!player.PA_chal.completed.includes(id)) {
                player.PA_chal.completed.push(id)
            }
            if (id == 21 && player.mults.lte(0) && player.metas.lte(0) && player.sacrifice.lte(1)) unlockAchievement(29)
        }
        PLReset()
        player.PA_chal.active = 0
    }
}

function PVChal(id) {
    if (player.volume_chal.enabled == id) {
        if (player.volume_chal.active == 0) {
            PAReset()
            player.volume_chal.active = id
        } else if (player.volume_chal.active == id) {
            if (player.pAreas.points.gte(CHALLENGE.pVolumes[id].goal())) {
                if (!player.volume_chal.completed[id]) player.volume_chal.completed[id] = 0
                if (player.volume_chal.completed[id] < 5) player.volume_chal.completed[id]++
            }
            player.studies.spent = 0
            player.studies.upgs = []
            player.volume_chal.enabled = 0
            PAReset()
            player.volume_chal.active = 0
        }
    }
}

function buyUPG(upg, id) {
    let cost = UPGRADE[upg][id].cost()
    if (upg == 'post_gens') {
        if (player.pAreas.points.gte(cost) & !player.PG_upgs.includes(id)) {
            player.pAreas.points = player.pAreas.points.sub(cost)
            player.PG_upgs.push(id)
        }
    } else {
        if (player[upg].points.gte(cost) & !player[upg].upgs.includes(id)) {
            player[upg].points = player[upg].points.sub(cost)
            player[upg].upgs.push(id)
        }
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

function tetrGenerator(x) {
    if (player.generators[x][2].gte(100)) {
        player.generators[x][1] = E(0)
        player.generators[x][2] = E(1)
        player.gen_tetr[x] = player.gen_tetr[x].add(1)
    }
}

function tierMult() {
    if (player.mults.gte(100)) {
        player.mults = E(0)
        player.multTiers = player.multTiers.add(1)
    }
}

function tierMeta() {
    if (player.metas.gte(100)) {
        player.metas = E(0)
        player.metaTiers = player.metaTiers.add(1)
    }
}

function tetrMult() {
    if (player.multTiers.gte(100)) {
        player.mults = E(0)
        player.multTiers = E(1)
        player.multTetrs = player.multTetrs.add(1)
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
        if (player.pAreas.upgs.includes(13)) {if (player.metas.lt(FORMULA.meta_bulk())) player.metas = FORMULA.meta_bulk()}
        else player.metas = player.metas.add(1)
        player.money = E(player.achievements.includes(25)?200:10)
        if (player.achievements.includes(41)) player.money = E('2e50')
        player.generators = []
        player.gen_tetr = []
        for (let i = 0; i < 8; i++) player.generators.push([E(0),E(0),E(1)])
        for (let i = 0; i < 8; i++) player.gen_tetr.push(E(1))
        player.mults = E(0)
        player.multTiers = E(1)
        player.multTetrs = E(1)
        unlockFeature('sacrifice')
        if (!player.achievements.includes(47)) player.sacrifice = E(1)
    }
}

function getMeta() {
    let get_metas = FORMULA.areaity.meta_gain().toNumber()
    if (get_metas > 0 && FORMULA.areaity.upgs[3].cur().gt(player.areaity.metas)) {
        player.areaity.powers = E(1)
        player.areaity.metas += get_metas
        if (FORMULA.areaity.upgs[3].cur().lt(player.areaity.metas)) player.areaity.metas = FORMULA.areaity.upgs[3].cur().toNumber()
    }
}

function bulkGen(x) {
    if (FORMULA.generator_bulk(x,player.money,player.generators[x][2]).gt(player.generators[x][1])) {
        player.generators[x][0] = player.generators[x][0].add(FORMULA.generator_bulk(x,player.money,player.generators[x][2]).sub(player.generators[x][1]))
        player.generators[x][1] = FORMULA.generator_bulk(x,player.money,player.generators[x][2])
        player.money = player.money.sub(FORMULA.generator_cost(x,FORMULA.generator_bulk(x,player.money,player.generators[x][2]).sub(player.generators[x][2].sub(1).mul(100).max(1)),player.generators[x][2]))
    }
}

function bulkAGen(x) {
    if (FORMULA.pa_generator.bulk(x,player.pAreas.points,player.PA_generators[x][2]).gt(player.PA_generators[x][1])) {
        player.PA_generators[x][0] = player.PA_generators[x][0].add(FORMULA.pa_generator.bulk(x,player.pAreas.points,player.PA_generators[x][2]).sub(player.PA_generators[x][1]))
        player.PA_generators[x][1] = FORMULA.pa_generator.bulk(x,player.pAreas.points,player.PA_generators[x][2])
        player.pAreas.points = player.pAreas.points.sub(FORMULA.pa_generator.cost(x,FORMULA.pa_generator.bulk(x,player.pAreas.points,player.PA_generators[x][2]).sub(player.PA_generators[x][2].sub(1).mul(100).max(1)),player.PA_generators[x][2]))
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

function buyMaxAG() {
    for (let i = 0; i < 8; i++) if (player.PA_gen_unls > i) {
        bulkAGen(i)
    } 
}

function sacrificeGen() {
    if ((player.metas.gte(1) || player.pAreas.upgs.includes(43)) && FORMULA.gen8_have().gte(1)) {
        if (FORMULA.sacrifice().gte('e60000')) unlockAchievement(35)
        player.sacrifice = player.sacrifice.mul(FORMULA.sacrifice())
        if (!player.achievements.includes(46)) for (let i = 0; i < 7; i++) player.generators[i][0] = E(0)
    }
}

function transformPL() {
    if (FORMULA.planckAreas_gain().gte(1)) {
        if (FORMULA.planckAreas_gain().gte('1e9')) unlockAchievement(39)
        player.pAreas.points = player.pAreas.points.add(FORMULA.planckAreas_gain())
        player.pAreas.times = player.pAreas.times.add(FORMULA.pa_stat_gain())
        if (player.metas.lte(0)) unlockAchievement(27)
        if (FORMULA.gen8_have().lte(0)) unlockAchievement(28)
        PLReset()
    }
}

function transformPA() {
    if (FORMULA.planckVolumes_gain().gte(1)) if (confirm('Transform PA will reset everything except achievements. You will also gain an Volume Lengths and unlock various upgrades.')) {
        unlockFeature('planckVolumes')
        if (player.PA_powers.lte(0)) unlockAchievement(47)
        player.pVolumes.points = player.pVolumes.points.add(FORMULA.planckVolumes_gain())
        player.pVolumes.times = player.pVolumes.times.add(1)
        if (player.respec && player.volume_chal.active == 0) {
            player.respec = false
            player.studies.spent = 0
            player.studies.upgs = []
            player.volume_chal.enabled = 0
        }
        PAReset()
    }
}

function PLReset() {
    if (player.achievements.includes(41)) player.money = E('2e50')
    else player.money = E(player.achievements.includes(25)?200:10)
    player.generators = []
    player.gen_tetr = []
    for (let i = 0; i < 8; i++) player.generators.push([E(0),E(0),E(1)])
    for (let i = 0; i < 8; i++) player.gen_tetr.push(E(1))
    player.mults = E(0)
    player.multTiers = E(1)
    player.multTetrs = E(1)
    player.metas = E(0)
    if (!player.studies.upgs.includes(41)) player.areaity.metas = 0
    player.metaTiers = E(1)
    player.sacrifice = E(1)
}

function PAReset() {
    if (!player.pVolumes.times.gte(MILESTONES[42].req)) player.PA_gen_unls = 0
    player.PA_generators = []
    for (let i = 0; i < 8; i++) player.PA_generators.push([E(0),E(0),E(1)])
    player.PA_powers = E(0)
    player.pAreas.points = E(0)
    player.pAreas.times = E(0)
    if (!player.pVolumes.times.gte(MILESTONES[22].req)) player.pAreas.upgs = []
    if (player.pVolumes.times.gte(MILESTONES[12].req)) player.pAreas.times = E(5)
    if (player.pVolumes.times.gte(MILESTONES[31].req)) player.pAreas.points = E(1e10)
    player.PA_mult = E(0)
    if (!player.pVolumes.times.gte(MILESTONES[32].req)) {
        player.PA_chal.unl = []
        player.PA_chal.completed = []
    }
    player.PA_chal.active = 0
    if (!player.pVolumes.times.gte(MILESTONES[51].req)) player.PG_upgs = []
    if (player.pVolumes.times.lt(MILESTONES[12].req)) {
        player.generators_autobuyer = []
        for (let i = 0; i < 8; i++) player.generators_autobuyer.push([false,false])
        player.mults_autobuyer = [false,false]
        player.metas_autobuyer = [false,false]
    }
    player.areaity.unl = false
    player.areaity.powers = E(1)
    player.areaity.upgs = [0,0,0]
    player.areaity.metas = 0
    PLReset()
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