const VOL_GEN_COST = [E(1),E(2),E(3),E(5)]

const MILESTONES = {
    row: 2,
    col: 2,
    11: {
        req: E(1),
        desc: 'Unlock the PA multiplier autobuyer',
    },
    12: {
        req: E(2),
        desc: 'You keep your autobuyer on Transform PA',
    },
    21: {
        req: E(3),
        desc: 'Unlock the areaity autobuyer (which have unlocked)',
    },
    22: {
        req: E(4),
        desc: 'You keep your PA upgrades on Transform PA, except for your PA multiplier',
    },
}

const STUDIES = {
    11: {
        branches: [],
        unl: () => { return true },
        color: 'normal',
        desc: 'Multiplier Powers boost Volume Generator 1.',
        cost: E(1),
        cur: () => { return E(10).pow(player.mults.add(player.multTiers.sub(1).mul(100)).div(1500)) },
        curDesc: (x) => { return 'x'+notate(x,1) },
    },
    21: {
        branches: [11],
        unl: () => { return player.studies.upgs.includes(11) },
        color: 'normal',
        desc: 'Unlock Areaity.',
        cost: E(4),
    },
    22: {
        branches: [11],
        unl: () => { return player.studies.upgs.includes(11) },
        color: 'normal',
        desc: 'Gain more PA stat based on Multiplier powers.',
        cost: E(2),
        cur: () => { return player.mults.add(player.multTiers.sub(1).mul(100)).add(1).pow(0.9) },
        curDesc: (x) => { return 'x'+notate(x,1) },
    },
    31: {
        branches: [21],
        unl: () => { return player.studies.upgs.includes(21) },
        color: 'normal',
        desc: 'Gain more PA based on Meta powers.',
        cost: E(5),
        cur: () => { return FORMULA.meta_have().add(1).pow(1.3) },
        curDesc: (x) => { return 'x'+notate(x,1) },
    },
    32: {
        branches: [22],
        unl: () => { return player.studies.upgs.includes(22) },
        color: 'normal',
        desc: 'Meta Tier cost are cheaper.',
        cost: E(6),
    },
}

function buyStudy(id) {
    let cost = STUDIES[id].cost
    if (FORMULA.studies.have().gte(cost) && STUDIES[id].unl() && !player.studies.upgs.includes(id)) {
        player.studies.spent += cost.toNumber()
        player.studies.upgs.push(id)
    }
}