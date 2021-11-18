/*jslint node: true */
/*jshint -W061 */
/*global goog, Map, let */
"use strict";
// General requires
require('google-closure-library');
goog.require('goog.structs.PriorityQueue');
goog.require('goog.structs.QuadTree');
const defaults = require("../../config.json");
if (global.fingerPrint.digitalOcean) {
    defaults.WIDTH = 6750;
    defaults.HEIGHT = 6750;
    defaults.maxPlayers = 20;
}

function getBaseShuffling(teams) {
    const output = [];
    for (let i = 1; i < 5; i ++) {
        output.push(i > teams ? 0 : i);
    }
    return output.sort(function() { return .5 - Math.random(); });
}

function id(i, level = true) {
    if (i) {
        return !!level ? `bas${i}` : `bap${i}`;
    } else {
        const list = ["rock", "rock", "roid"];
        return list[Math.floor(Math.random() * list.length)];
    }
}

function setup(options = {}) {
    if (options.width == null) options.width = defaults.X_GRID;
    if (options.height == null) options.height = defaults.Y_GRID;
    if (options.nestWidth == null) options.nestWidth = Math.round(defaults.X_GRID / 4);
    if (options.nestHeight == null) options.nestHeight = Math.round(defaults.Y_GRID / 4);
    if (options.rockScatter == null) options.rockScatter = .15;
    options.rockScatter = 1 - options.rockScatter;
    const output = [];
    const nest = {
        sx: Math.round(options.width / 2 - options.nestWidth / 2),
        sy: Math.round(options.height / 2 - options.nestHeight / 2),
        ex: Math.round(options.width / 2 - options.nestWidth / 2) + options.nestWidth,
        ey: Math.round(options.height / 2 - options.nestHeight / 2) + options.nestHeight
    };
    function testIsNest(x, y) {
        if (x >= nest.sx && nest <= nest.ex) {
            if (y >= nest.sy && nest <= nest.ey) {
                return true;
            }
        }
        return false;
    }
    for (let i = 0; i < options.height; i ++) {
        const row = [];
        for (let j = 0; j < options.width; j ++) {
            row.push(testIsNest(j, i) ? "nest" : Math.random() > options.rockScatter ? Math.random() > .5 ? "roid" : "rock" : "norm");
        }
        output.push(row);
    }
    return output;
}

const gamemode = "Open TDM";////Math.random() > .75 ? "FFA" : "TDM";
const gamemodes = {
    "FFA": {}, // "defaults" is already FFA.
    "TDM": (function() {
        const teams = 2 + (Math.random() * 3 | 0);
        const bases = getBaseShuffling(teams);
        const map = (Math.random() > .5 ? [
            ["roid", "rock", "norm", "norm", "norm", "norm", id(bases[0], 1), id(bases[0], 0), id(bases[0], 1), "norm", "norm", "norm", "norm", "rock", "roid"],
            ["rock", "roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "roid", "rock"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "nest", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            [id(bases[2], 1), "norm", "norm", "norm", "norm", "rock", "nest", "nest", "nest", "rock", "norm", "norm", "norm", "norm", id(bases[3], 1)],
            [id(bases[2], 0), "norm", "norm", "norm", "norm", "nest", "nest", "nest", "nest", "nest", "norm", "norm", "norm", "norm", id(bases[3], 0)],
            [id(bases[2], 1), "norm", "norm", "norm", "norm", "rock", "nest", "nest", "nest", "rock", "norm", "norm", "norm", "norm", id(bases[3], 1)],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "nest", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["rock", "roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "rock", "norm"],
            ["roid", "rock", "norm", "norm", "norm", "norm", id(bases[1], 1), id(bases[1], 0), id(bases[1], 1), "norm", "norm", "norm", "norm", "rock", "roid"]
        ] : [
            [id(bases[0], 0), id(bases[0], 1), "norm", "norm", "norm", "norm", "rock", "roid", "rock", "norm", "norm", "norm", "norm", id(bases[3], 1), id(bases[3], 0)],
            [id(bases[0], 1), "roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "roid", id(bases[3], 1)],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "rock", "roid", "rock", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "nest", "nest", "nest", "nest", "nest", "norm", "norm", "norm", "norm", "norm"],
            ["rock", "norm", "norm", "norm", "rock", "nest", "nest", "nest", "nest", "nest", "rock", "norm", "norm", "norm", "rock"],
            ["roid", "norm", "norm", "norm", "roid", "nest", "nest", "nest", "nest", "nest", "roid", "norm", "norm", "norm", "roid"],
            ["rock", "norm", "norm", "norm", "rock", "nest", "nest", "nest", "nest", "nest", "rock", "norm", "norm", "norm", "rock"],
            ["norm", "norm", "norm", "norm", "norm", "nest", "nest", "nest", "nest", "nest", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "rock", "roid", "rock", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            ["norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm"],
            [id(bases[2], 1), "roid", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "norm", "rock", id(bases[1], 1)],
            [id(bases[2], 0), id(bases[2], 1), "norm", "norm", "norm", "norm", "rock", "roid", "rock", "norm", "norm", "norm", "norm", id(bases[1], 1), id(bases[1], 0)]
        ]);
        return {
            MODE: "tdm",
            TEAMS: teams,
            X_GRID: 15,
            Y_GRID: 15,
            ROOM_SETUP: map
        }
    })(),
    "Open TDM": {
        MODE: "tdm",
        TEAMS: 2 + (Math.random() * 3 | 0),
        ROOM_SETUP: setup()
    },
    "Naval Battle": {
        NAVAL_SHIPS: true,
        WIDTH: 7500,
        HEIGHT: 7500,
        FOOD_AMOUNT: 0,
        MODE: "tdm",
        TEAMS: 2
    }
};
const mode = gamemodes[gamemode];
let output = {};
for (let key in defaults) {
    output[key] = defaults[key];
    if (mode[key] != null) output[key] = mode[key];
}
output.gameModeName = gamemode;
if (gamemode.includes("TDM")) {
    output.gameModeName = `${output.TEAMS} ${gamemode}`;
}
module.exports = {
    output
};
