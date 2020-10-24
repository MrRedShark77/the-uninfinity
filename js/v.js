var app;

function loadVue() {
	app = new Vue({
	    el: "#app",
	    data: {
			player,
			FORMULA,
			TABS,
			STABS,
			TABS_UNLS,
			STABS_UNLS,
			ACHIEVEMENTS,
			UPGRADE,
			CHALLENGE,
			UNL_PA_GEN,
			STUDIES,
			VOL_GEN_COST,
			MILESTONES,
			chalText,
			PAChal,
			buyUPG,
			buyStudy,
			notate,
			buyGenerator,
			tierGenerator,
			buyPAGenerator,
			tierPAGenerator,
			buyPVGenerator,
			tierPVGenerator,
			achImage,
        }
	})
}