$(document).ready(function() {
    var layout = {
        generate: function() {
            var val = prompt('Order of minesweeper?'),
                mbody = mines.doms.mbody;
            for (var i = 0; i < val; i++) {
                mbody.append("<tr>");
                var tr = $(".mine-body tr:last-child");
                for (var j = 0; j < val; j++) {
                    tr.append("<td>");
                }
            }
            mines.initialise();
        }
    }
    var mines = {
        doms: {
            "mbody": $(".mine-body"),
            "mbodytr": $(".mine-body tr"),
            "mbodytd": $(".mine-body tr:first-child td"),
            "mbodytdtotal": $(".mine-body tr td")
        },

        globals: {
            "rownum": 0,
            "colnum": 0,
            "minecount": 0,
            "emptycount": 0,
            "guesscount": 0,
            "minepos": [],
            "mineLoc": []
        },
        initialise: function() {
            mines.doms.mbodytr = $(".mine-body tr");
            mines.doms.mbodytd = $(".mine-body tr:first-child td");
            mines.doms.mbodytdtotal = $(".mine-body td");
        },
        generatemine: function() {
            var rownum = mines.globals.rownum,
                colnum = mines.globals.colnum,
                minecount = mines.globals.minecount,
                totalnum = rownum * colnum;
            var numOfmines = $("#numofmines"),
                numOfguess = $("#numofguess");
            var str = "Mines: " + mines.globals.minecount;
            numOfmines.text(str);
            str = "Guess: " + mines.globals.guesscount;
            numOfguess.text(str);
            var rand = [],
                i = 1;
            rand[0] = Math.floor(Math.random() * totalnum);
            while (i < minecount) {
                var randval = Math.floor(Math.random() * totalnum),
                    flag = true;
                for (key in rand) {
                    if (rand[key] === randval) {
                        flag = false;
                    }
                }
                if (flag === true) {
                    rand[i] = randval;
                    i++;
                }
            }
            var row = mines.doms.mbodytr,
                xlen = row.length,
                pos = 0,
                randLoc = [],
                loc = 0;
            for (var i = 0; i < xlen; i++) {
                var col = row[i].children,
                    ylen = col.length;
                for (var j = 0; j < ylen; j++) {
                    if (rand.indexOf(pos) > -1) {
                        var str = i + "," + j;
                        randLoc[loc] = str;
                        loc++;
                    }
                    pos++;
                }
            }
            mines.globals.minepos = rand;
            mines.globals.mineLoc = randLoc;
        },
        setval: function() {
            mines.globals.rownum = mines.doms.mbodytr.length;
            mines.globals.colnum = mines.doms.mbodytd.length;
            var total = mines.globals.rownum * mines.globals.colnum;
            mines.globals.minecount = Math.floor(total / 3);
            mines.globals.emptycount = total - mines.globals.minecount;
            mines.generatemine();
        },
        change: function(el, pos, posVal) {
            if (el.attr("class") !== "guess" && el.attr("class") !== "empty") {
                if (mines.globals.mineLoc.indexOf(pos) > -1) {
                    mines.gameCheck("bomb");
                } else {
                    el.addClass("empty");
                    if (posVal > 0) {
                        el.text(posVal);
                    }
                    mines.gameCheck("empty");
                }
            }
        },
        findpos: function(el) {
            var row = mines.doms.mbodytr,
                xlen = row.length,
                pos = "",
                el = el.currentTarget;
            for (var i = 0; i < xlen; i++) {
                var col = row[i].children,
                    ylen = col.length;
                for (var j = 0; j < ylen; j++) {
                    if (el === col[j]) {
                        pos = i + "," + j;
                        return pos;
                    }
                }
            }
        },
        adjacency: function(pos) {
            var values = pos.split(','),
                x = Number(values[0]),
                y = Number(values[1]),
                count = 0;
            for (var i = x - 1; i <= x + 1; i++) {
                for (var j = y - 1; j <= y + 1; j++) {
                    if ((i > -1 && j > -1) && (i !== x || j !== y)) {
                        var loc = i + "," + j;
                        if (mines.globals.mineLoc.indexOf(loc) > -1) {
                            count++;
                        }
                    }
                }
            }
            return count;
        },
        resetBoard: function() {
            mines.globals.rownum = 0;
            mines.globals.colnum = 0;
            mines.globals.minecount = 0;
            mines.globals.emptycount = 0;
            mines.globals.guesscount = 0;
            mines.globals.mineLoc = [];
            mines.globals.minepos = [];
            mines.rearrange();
        },
        rearrange: function() {
            var mines = $(".mine-body tr td"),
                len = mines.length;
            for (var i = 0; i < len; i++) {
                mines.eq(i).text("");
                mines.eq(i).attr("class", "");
            }
        },
        gameCheck: function(param) {
            if (param === "bomb") {
                var elements = mines.doms.mbodytdtotal,
                    len = elements.length;
                for (var i = 0; i < len; i++) {
                    if (mines.globals.minepos.indexOf(i) > -1) {
                        elements.eq(i).addClass("mine");
                    } else {
                        elements.eq(i).addClass("empty");
                    }
                }
                alert("You lose the game");
            } else {
                var empty = $(".empty"),
                    len = empty.length;
                if (len === mines.globals.emptycount) {
                    alert("Congrats!!You win the game");
                } else {
                    return;
                }
            }
        },
        guess: function(el) {
            if (el.attr("class") !== "empty") {
                if (el.attr("class") !== "guess") {
                    if (mines.globals.guesscount < mines.globals.minecount) {
                        el.addClass("guess");
                        mines.globals.guesscount++;
                    }
                } else {
                    el.removeClass("guess");
                    mines.globals.guesscount--;
                }
                var numOfguess = $("#numofguess");
                str = "Guess: " + mines.globals.guesscount;
                numOfguess.text(str);
            }
        }
    }
    layout.generate();
    mines.setval();
    //mines.adjacency();
    mines.doms.mbodytdtotal.click(function(event) {
        var pos = mines.findpos(event),
            posVal = mines.adjacency(pos);
        mines.change($(this), pos, posVal);
    });
    $("#reset").click(function() {
        mines.resetBoard();
        mines.setval();
    });
    document.oncontextmenu = function() {
        return false;
    };
    mines.doms.mbodytdtotal.mousedown(function(e) {
        if (e.button == 2) {
            mines.guess($(this));
            return false;
        }
        return true;
    });

});
