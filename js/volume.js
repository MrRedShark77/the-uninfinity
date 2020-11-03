const VOL_GEN_COST = [E(1),E(2),E(3),E(5)]

const ID_CHAL = {
    131: 11,
    132: 12,
    43: 21,
}

const MILESTONES = {
    row: 2,
    col: 5,
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
    31: {
        req: E(6),
        desc: 'Start with 1e10 PA',
    },
    32: {
        req: E(9),
        desc: 'You keep your PA challenges on Transform PA',
    },
    41: {
        req: E(14),
        desc: 'Unlock Area generators autobuyer',
    },
    42: {
        req: E(20),
        desc: 'You keep your Area generators unlocked on Transform PA',
    },
    51: {
        req: E(30),
        desc: 'You keep post-generators upgrades on Transform PA',
    },
    52: {
        req: E(45),
        desc: 'Placeholder',
    },
}

const STUDIES = {
    11: {
        branches: [],
        unl: () => { return true },
        color: 'normal',
        desc: 'Multiplier Powers boost Volume Generator 1.',
        cost: E(1),
        cur: () => { return E(10).pow(player.mults.add(player.multTiers.sub(1).mul(100)).add(player.multTetrs.sub(1).mul(10000)).div(1500)) },
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
        cur: () => { return player.mults.add(player.multTiers.sub(1).mul(100)).add(player.multTetrs.sub(1).mul(10000)).add(1).pow(0.9) },
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
    41: {
        branches: [31],
        unl: () => { return player.studies.upgs.includes(31) },
        color: 'normal',
        desc: 'Keep areaity metas on transform PL.',
        cost: E(2),
    },
    42: {
        branches: [31,32],
        unl: () => { return player.studies.upgs.includes(31) || player.studies.upgs.includes(32) },
        color: 'normal',
        desc: 'Gain 1e6x more PA.',
        cost: E(3),
    },
    43: {
        branches: [32],
        unl: () => { return player.studies.upgs.includes(32) && FORMULA.gen8_have().gte(5000) && player.volume_chal.enabled == 0 },
        color: 'pv_chal',
        desc: 'Volume Challenge 3. (Requires 5000 length generators 8)',
        cost: E(0),
    },
    44: {
        branches: [43],
        unl: () => { return player.studies.upgs.includes(32) && FORMULA.v_chal_times(21) > 0 },
        color: 'normal',
        desc: 'Areaity effect formula is better.',
        cost: E(3),
    },
    51: {
        branches: [42],
        unl: () => { return player.studies.upgs.includes(42) },
        color: 'normal',
        desc: 'Gain 7x more PV.',
        cost: E(3),
    },
    61: {
        branches: [51],
        unl: () => { return player.studies.upgs.includes(51) && !(player.studies.upgs.includes(62) || player.studies.upgs.includes(63)) },
        color: 'path1',
        desc: 'Sacrifice effect boost other length generators.',
        cost: E(6),
        cur: () => { return player.sacrifice.add(1).pow(1/10) },
        curDesc: (x) => { return 'x'+notate(x,1) },
    },
    62: {
        branches: [51],
        unl: () => { return player.studies.upgs.includes(51) && !(player.studies.upgs.includes(61) || player.studies.upgs.includes(63)) },
        color: 'path2',
        desc: 'Sacrifice effect boost area generators 4.',
        cost: E(4),
        cur: () => { return player.sacrifice.add(1).pow(1/2500) },
        curDesc: (x) => { return 'x'+notate(x,1) },
    },
    63: {
        branches: [51],
        unl: () => { return player.studies.upgs.includes(51) && !(player.studies.upgs.includes(61) || player.studies.upgs.includes(62)) },
        color: 'path3',
        desc: 'Sacrifice effect boost volume generators.',
        cost: E(3),
        cur: () => { return player.sacrifice.add(1).log10().add(1).pow(1/2) },
        curDesc: (x) => { return 'x'+notate(x,1) },
    },
    71: {
        branches: [61],
        unl: () => { return player.studies.upgs.includes(61) },
        color: 'path1',
        desc: 'Multipler base become 1.25x.',
        cost: E(8),
    },
    72: {
        branches: [62],
        unl: () => { return player.studies.upgs.includes(62) },
        color: 'path2',
        desc: 'Multipler powers boost area generators.',
        cost: E(3),
        cur: () => { return E(1.01).pow(player.mults.add(player.multTiers.sub(1).mul(100)).add(player.multTetrs.sub(1).mul(10000))) },
        curDesc: (x) => { return 'x'+notate(x) },
    },
    73: {
        branches: [63],
        unl: () => { return player.studies.upgs.includes(63) },
        color: 'path3',
        desc: 'Multipler powers are 0.15% more effective for each Multipler upgrades gained from Volume generators.',
        cost: E(4),
        cur: () => { return FORMULA.pv_powers_eff.mults_gain().mul(0.0015).add(1) },
        curDesc: (x) => { return '+'+notate(x.sub(1).mul(100),1)+'%' },
    },
    81: {
        branches: [71],
        unl: () => { return player.studies.upgs.includes(71) },
        color: 'path1',
        desc: 'Areaity metas boost areaity multipler.',
        cost: E(6),
        cur: () => { return E(player.areaity.metas).add(1).pow(2) },
        curDesc: (x) => { return 'x'+notate(x,0) },
    },
    82: {
        branches: [72],
        unl: () => { return player.studies.upgs.includes(72) },
        color: 'path2',
        desc: 'Areaity powers boost Length generators.',
        cost: E(5),
        cur: () => { return player.areaity.powers.pow(50) },
        curDesc: (x) => { return 'x'+notate(x,0) },
    },
    83: {
        branches: [73],
        unl: () => { return player.studies.upgs.includes(73) },
        color: 'path3',
        desc: 'Areaity metas boost Volume generators.',
        cost: E(5),
        cur: () => { return E(player.areaity.metas).add(1).pow(3) },
        curDesc: (x) => { return 'x'+notate(x,0) },
    },
    91: {
        branches: [81,82,83],
        unl: () => { return player.studies.upgs.includes(81) || player.studies.upgs.includes(82) || player.studies.upgs.includes(83) },
        color: 'normal',
        desc: 'Make the PA formula better.',
        cost: E(7),
    },
    101: {
        branches: [91],
        unl: () => { return player.studies.upgs.includes(91) },
        color: 'normal',
        desc: 'Multiply Volume generators by 1,000.',
        cost: E(6),
    },
    111: {
        branches: [101],
        unl: () => { return player.studies.upgs.includes(101) },
        color: 'normal',
        desc: 'Multiply Length generators by e200,000.',
        cost: E(5),
    },
    112: {
        branches: [101],
        unl: () => { return player.studies.upgs.includes(101) },
        color: 'normal',
        desc: 'Multiply Area generators by 1e50.',
        cost: E(5),
    },
    121: {
        branches: [111,112],
        unl: () => { return player.studies.upgs.includes(111) || player.studies.upgs.includes(112) },
        color: 'normal',
        desc: 'Volume powers requirement for the next multipler upgrade is reduced.',
        cost: E(8),
    },
    131: {
        branches: [121],
        unl: () => { return player.studies.upgs.includes(121) && player.pVolumes.times.gte(25) && player.volume_chal.enabled == 0 },
        color: 'pv_chal',
        desc: 'Volume Challenge 1. (Requires 25 PV stat)',
        cost: E(20),
    },
    132: {
        branches: [121],
        unl: () => { return player.studies.upgs.includes(121) && FORMULA.pv_powers_eff.mults_gain().gte(1500) && player.volume_chal.enabled == 0 },
        color: 'pv_chal',
        desc: 'Volume Challenge 2. (Requires 1500 multiplier upgrades gained from Volume generators)',
        cost: E(40),
    },
    141: {
        branches: [131,132],
        unl: () => { return player.studies.upgs.includes(121) && FORMULA.v_chal_times(11) > 0 && FORMULA.v_chal_times(12) > 0 },
        color: 'normal',
        desc: 'You gain 1% of your PA and stat gained on transform PL each second.',
        cost: E(200),
    },
    151: {
        branches: [141],
        unl: () => { return player.studies.upgs.includes(141) },
        color: 'normal',
        desc: 'Multiply PA based on unspent PL.',
        cost: E(200),
        cur: () => { return player.money.add(1).log10().add(1).pow(3) },
        curDesc: (x) => { return 'x'+notate(x,0) },
    },
    152: {
        branches: [141],
        unl: () => { return player.studies.upgs.includes(141) },
        color: 'normal',
        desc: 'Raise PA powers effect based on PA powers.',
        cost: E(200),
        cur: () => { return player.PA_powers.add(1).log10().add(1).pow(1/4) },
        curDesc: (x) => { return '^'+notate(x,2) },
    },
    153: {
        branches: [141],
        unl: () => { return player.studies.upgs.includes(141) },
        color: 'normal',
        desc: 'Areaity metas are 50% stronger.',
        cost: E(200),
    },
}

function buyStudy(id) {
    let cost = STUDIES[id].cost
    if (FORMULA.studies.have().gte(cost) && STUDIES[id].unl() && !player.studies.upgs.includes(id)) {
        player.studies.spent += cost.toNumber()
        player.studies.upgs.push(id)
        if (STUDIES[id].color == 'pv_chal') {
            player.stab = 3
            player.volume_chal.enabled = ID_CHAL[id]
            if (!player.volume_chal.unl.includes(ID_CHAL[id])) player.volume_chal.unl.push(ID_CHAL[id])
        }
    }
}