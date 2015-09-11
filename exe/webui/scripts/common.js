function getFeedback(e, t, n, r) {
    var i, s;
    if (r == "truefalse") {
        var o = "right";
        if (e == 1) o = "wrong";
        var u = document.getElementById("s" + n + "-result");
        var a = document.getElementById("s" + n);
        if (!u || !a) return false;
        var f = $exe_i18n.incorrect;
        if (u.className == o) f = $exe_i18n.correct;
        u.innerHTML = f;
        a.style.display = "block"
    } else {
        for (i = 0; i < t; i++) {
            s = "sa" + i + "b" + n;
            if (i == e) document.getElementById(s).style.display = "block";
            else document.getElementById(s).style.display = "none"
        }
    }
}

function onClozeChange(ele) {
    var ident = getClozeIds(ele)[0];
    var instant = eval(document.getElementById("clozeFlag" + ident + ".instantMarking").value);
    if (instant) {
        checkAndMarkClozeWord(ele);
        var scorePara = document.getElementById("clozeScore" + ident);
        scorePara.innerHTML = ""
    }
}

function clozeSubmit(e) {
    showClozeScore(e, 1);
    toggleElementVisible("submit" + e);
    toggleElementVisible("restart" + e);
    toggleElementVisible("showAnswersButton" + e);
    toggleClozeFeedback(e)
}

function clozeRestart(e) {
    toggleClozeFeedback(e);
    toggleClozeAnswers(e, true);
    toggleElementVisible("restart" + e);
    toggleElementVisible("showAnswersButton" + e);
    toggleElementVisible("submit" + e)
}

function toggleClozeAnswers(e, t) {
    var n = true;
    var r = getCloseInputs(e);
    if (!t) {
        for (var i = 0; i < r.length; i++) {
            var s = r[i];
            if (getClozeMark(s) != 2) {
                n = false;
                break
            }
        }
    }
    if (n) {
        clearClozeInputs(e, r)
    } else {
        fillClozeInputs(e, r)
    }
    var o = document.getElementById("clozeScore" + e);
    o.innerHTML = "";
    var u = document.getElementById("getScore" + e);
    if (u) {
        u.disabled = !n
    }
}

function fillClozeInputs(e, t) {
    if (!t) {
        var t = getCloseInputs(e)
    }
    for (var n = 0; n < t.length; n++) {
        var r = t[n];
        var i = getClozeAnswer(r);
        i = i.trim();
        var s = false;
        if (i.indexOf("|") == 0 && i.charAt(i.length - 1) == "|") {
            var o = i;
            var o = o.substring(1, o.length - 1);
            var u = o.split("|");
            if (u.length > 1) {
                s = true;
                var a = "";
                for (x = 0; x < u.length; x++) {
                    a += u[x];
                    if (x < u.length - 1) a += " — ";
                    if (u[x] == "") s = false
                }
            }
            if (s) {
                r.className = "autocomplete-off width-" + r.style.width;
                r.style.width = "auto";
                i = a
            }
        }
        r.value = i;
        markClozeWord(r, CORRECT);
        r.setAttribute("readonly", "readonly")
    }
}

function clearClozeInputs(e, t) {
    if (!t) {
        var t = getCloseInputs(e)
    }
    for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.value = "";
        markClozeWord(r, NOT_ATTEMPTED);
        r.removeAttribute("readonly")
    }
}

function checkAndMarkClozeWord(e) {
    var t = checkClozeWord(e);
    if (t != "") {
        markClozeWord(e, CORRECT);
        e.value = t;
        return CORRECT
    } else if (!e.value) {
        markClozeWord(e, NOT_ATTEMPTED);
        return NOT_ATTEMPTED
    } else {
        markClozeWord(e, WRONG);
        return WRONG
    }
}

function markClozeWord(e, t) {
    switch (t) {
        case 0:
            e.style.backgroundColor = "";
            e.style.color = "";
            break;
        case 1:
            e.style.backgroundColor = "#FF9999";
            e.style.color = "#000000";
            break;
        case 2:
            e.style.backgroundColor = "#CCFF99";
            e.style.color = "#000000";
            break
    }
    return t
}

function getClozeMark(e) {
    var t = checkClozeWord(e);
    if (t != "") {
        return CORRECT
    } else if (!e.value) {
        return NOT_ATTEMPTED
    } else {
        return WRONG
    }
}

function getClozeAnswer(e) {
    var t = getClozeIds(e);
    var n = t[0];
    var r = t[1];
    var i = document.getElementById("clozeAnswer" + n + "." + r);
    var s = i.innerHTML;
    s = decode64(s);
    s = unescape(s);
    result = "";
    var o = "X".charCodeAt(0);
    for (var u = 0; u < s.length; u++) {
        var a = s.charCodeAt(u);
        o ^= a;
        result += String.fromCharCode(o)
    }
    return result
}

function decode64(e) {
    var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var n = "";
    var r, i, s;
    var o, u, a, f;
    var l = 0;
    e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
    do {
        o = t.indexOf(e.charAt(l++));
        u = t.indexOf(e.charAt(l++));
        a = t.indexOf(e.charAt(l++));
        f = t.indexOf(e.charAt(l++));
        r = o << 2 | u >> 4;
        i = (u & 15) << 4 | a >> 2;
        s = (a & 3) << 6 | f;
        n = n + String.fromCharCode(r);
        if (a != 64) {
            n = n + String.fromCharCode(i)
        }
        if (f != 64) {
            n = n + String.fromCharCode(s)
        }
    } while (l < e.length);
    return n
}

function checkClozeWord(e) {
    var t = e.value;
    var n = getClozeAnswer(e);
    var r = n;
    r = r.trim();
    var i = r.indexOf("|");
    var s = r.lastIndexOf("|");
    if (i == 0 && s == r.length - 1) {
        var o = r.split("|");
        var u;
        for (var a in o) {
            if (o[a] != "") {
                u = checkClozeWordAnswer(e, o[a]);
                if (u != "") return o[a]
            }
        }
        return ""
    } else return checkClozeWordAnswer(e, r)
}

function checkClozeWordAnswer(ele, original_answer) {
    original_answer = original_answer.trim();
    var guess = ele.value;
    var answer = original_answer;
    var ident = getClozeIds(ele)[0];
    var strictMarking = eval(document.getElementById("clozeFlag" + ident + ".strictMarking").value);
    var checkCaps = eval(document.getElementById("clozeFlag" + ident + ".checkCaps").value);
    if (!checkCaps) {
        guess = guess.toLowerCase();
        answer = answer.toLowerCase()
    }
    if (guess == answer) return original_answer;
    else if (strictMarking || answer.length <= 4) return "";
    else {
        var i = 0;
        var j = 0;
        var orders = [
            [answer, guess],
            [guess, answer]
        ];
        var maxMisses = Math.floor(answer.length / 6) + 1;
        var misses = 0;
        if (guess.length <= maxMisses) {
            misses = Math.abs(guess.length - answer.length);
            for (i = 0; i < guess.length; i++) {
                if (answer.search(guess[i]) == -1) {
                    misses += 1
                }
            }
            if (misses <= maxMisses) {
                return original_answer
            } else {
                return ""
            }
        }
        for (i = 0; i < 2; i++) {
            var string1 = orders[i][0];
            var string2 = orders[i][1];
            while (string1) {
                misses = Math.floor((Math.abs(string1.length - string2.length) + Math.abs(guess.length - answer.length)) / 2);
                var max = Math.min(string1.length, string2.length);
                for (j = 0; j < max; j++) {
                    var a = string2.charAt(j);
                    var b = string1.charAt(j);
                    if (a != b) misses += 1;
                    if (misses > maxMisses) break
                }
                if (misses <= maxMisses) return original_answer;
                string1 = string1.substr(1)
            }
        }
        return ""
    }
}

function getClozeIds(e) {
    var t = e.id.slice(10);
    var n = t.indexOf(".");
    var r = t.slice(0, n);
    var i = t.slice(t.indexOf(".") + 1);
    return [r, i]
}

function showClozeScore(e, t) {
    var n = 0;
    var r = document.getElementById("cloze" + e);
    var i = getCloseInputs(e);
    for (var s = 0; s < i.length; s++) {
        var o = i[s];
        if (t) {
            var u = checkAndMarkClozeWord(o)
        } else {
            var u = getClozeMark(o)
        }
        if (u == 2) {
            n++
        }
    }
    var a = document.getElementById("clozeScore" + e);
    a.innerHTML = YOUR_SCORE_IS + n + "/" + i.length + "."
}

function getCloseInputs(e) {
    var t = new Array;
    var n = document.getElementById("cloze" + e);
    recurseFindClozeInputs(n, e, t);
    return t
}

function recurseFindClozeInputs(e, t, n) {
    for (var r = 0; r < e.childNodes.length; r++) {
        var i = e.childNodes[r];
        if (i.id) {
            if (i.id.search("clozeBlank" + t) == 0) {
                n.push(i);
                continue
            }
        }
        if (i.hasChildNodes()) {
            recurseFindClozeInputs(i, t, n)
        }
    }
}

function toggleClozeFeedback(e, t) {
    var n = document.getElementById("clozeVar" + e + ".feedbackId");
    if (n) {
        var r = n.value;
        if (t) {
            if (t.value == $exe_i18n.showFeedback) t.value = $exe_i18n.hideFeedback;
            else t.value = $exe_i18n.showFeedback
        }
        toggleElementVisible(r)
    }
}

function toggleElementVisible(e) {
    $("#" + e).toggle()
}

function insertAtCursor(e, t, n) {
    if (e.selectionStart || e.selectionStart == "0") {
        var r = e.selectionStart;
        var i = e.selectionEnd;
        e.value = e.value.substring(0, r) + t + e.value.substring(i, e.value.length);
        e.selectionStart = r + t.length - n
    } else {
        e.value += t
    }
    e.selectionEnd = e.selectionStart;
    e.focus()
}

function insertSymbol(e, t, n) {
    var r = document.getElementById(e);
    insertAtCursor(r, t, n)
}

function calcScore(e, t) {
    var n = 0,
        r, i;
    for (r = 0; r < e; r++) {
        var s = document.getElementById(t + r.toString());
        var o = document.getElementById("ans" + t + r.toString());
        i = "False";
        if (s.checked == 1) i = "True";
        if (i == s.value) {
            n++;
            o.style.color = "black"
        } else {
            o.style.color = "red"
        }
    }
    var u = document.getElementById("f" + t);
    u.style.display = "block";
    alert(YOUR_SCORE_IS + n + "/" + e)
}

function showFeedback(e, t, n) {
    var r, i, s, o;
    for (r = 0; r < t; r++) {
        var u = n + r.toString();
        var a = document.getElementById("op" + u);
        i = "False";
        s = $exe_i18n.incorrect;
        o = "wrong";
        if (a.checked == 1) i = "True";
        if (i == a.value) {
            s = "<strong>" + $exe_i18n.correct + "</strong>";
            o = "right"
        }
        var f = '<p class="' + o + '-option">' + s + "</p>";
        var l = $("#feedback-" + u);
        if (e.value == $exe_i18n.showFeedback) l.html(f).show();
        else l.hide()
    }
    if (e.value == $exe_i18n.showFeedback) {
        $("#f" + n).show();
        e.value = $exe_i18n.hideFeedback
    } else {
        $("#f" + n).hide();
        e.value = $exe_i18n.showFeedback
    }
}

function onClozelangChange(ele) {
    var ident = getClozelangIds(ele)[0];
    var instant = eval(document.getElementById("clozelangFlag" + ident + ".instantMarking").value);
    if (instant) {
        checkAndMarkClozelangWord(ele);
        var scorePara = document.getElementById("clozelangScore" + ident);
        scorePara.innerHTML = ""
    }
}

function clozelangSubmit(e) {
    showClozelangScore(e, 1);
    toggleElementVisible("submit" + e);
    toggleClozelangFeedback(e)
}

function clozelangRestart(e) {
    toggleClozelangFeedback(e);
    toggleClozelangAnswers(e, true);
    toggleElementVisible("restart" + e);
    toggleElementVisible("showAnswersButton" + e);
    toggleElementVisible("submit" + e)
}

function toggleClozelangAnswers(e, t) {
    var n = true;
    var r = getCloseInputsCloze(e);
    if (!t) {
        for (var i = 0; i < r.length; i++) {
            var s = r[i];
            if (getClozelangMark(s) != 2) {
                n = false;
                break
            }
        }
    }
    if (n) {
        clearClozelangInputs(e, r)
    } else {
        fillClozelangInputs(e, r)
    }
    var o = document.getElementById("clozelangScore" + e);
    o.innerHTML = "";
    var u = document.getElementById("getScore" + e);
    if (u) {
        u.disabled = !n
    }
}

function fillClozelangInputs(e, t) {
    if (!t) {
        var t = getCloseInputsCloze(e)
    }
    for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.value = getClozelangAnswer(r);
        markClozeWord(r, CORRECT);
        r.setAttribute("readonly", "readonly")
    }
}

function clearClozelangInputs(e, t) {
    if (!t) {
        var t = getCloseInputsCloze(e)
    }
    for (var n = 0; n < t.length; n++) {
        var r = t[n];
        r.value = "";
        markClozeWord(r, NOT_ATTEMPTED);
        r.removeAttribute("readonly")
    }
}

function checkAndMarkClozelangWord(e) {
    var t = checkClozelangWord(e);
    if (t != "") {
        markClozelangWord(e, CORRECT);
        e.value = t;
        return CORRECT
    } else if (!e.value) {
        markClozelangWord(e, NOT_ATTEMPTED);
        return NOT_ATTEMPTED
    } else {
        markClozelangWord(e, WRONG);
        return WRONG
    }
}

function markClozelangWord(e, t) {
    switch (t) {
        case 0:
            e.style.backgroundColor = "";
            break;
        case 1:
            e.style.backgroundColor = "#FF9999";
            break;
        case 2:
            e.style.backgroundColor = "#CCFF99";
            break
    }
    return t
}

function getClozelangMark(e) {
    switch (e.style.backgroundColor) {
        case "#FF9999":
            return 1;
        case "#CCFF99":
            return 2;
        default:
            return 0
    }
}

function getClozelangAnswer(e) {
    var t = getClozelangIds(e);
    var n = t[0];
    var r = t[1];
    var i = document.getElementById("clozelangAnswer" + n + "." + r);
    var s = i.innerHTML;
    s = decode64(s);
    s = unescape(s);
    result = "";
    var o = "X".charCodeAt(0);
    for (var u = 0; u < s.length; u++) {
        var a = s.charCodeAt(u);
        o ^= a;
        result += String.fromCharCode(o)
    }
    return result
}

function checkClozelangWord(ele) {
    var guess = ele.value;
    var original = getClozelangAnswer(ele);
    var answer = original;
    var guess = ele.value;
    var ident = getClozelangIds(ele)[0];
    var strictMarking = eval(document.getElementById("clozelangFlag" + ident + ".strictMarking").value);
    var checkCaps = eval(document.getElementById("clozelangFlag" + ident + ".checkCaps").value);
    if (!checkCaps) {
        guess = guess.toLowerCase();
        answer = original.toLowerCase()
    }
    if (guess == answer) return original;
    else if (strictMarking || answer.length <= 4) return "";
    else {
        var i = 0;
        var j = 0;
        var orders = [
            [answer, guess],
            [guess, answer]
        ];
        var maxMisses = Math.floor(answer.length / 6) + 1;
        var misses = 0;
        if (guess.length <= maxMisses) {
            misses = Math.abs(guess.length - answer.length);
            for (i = 0; i < guess.length; i++) {
                if (answer.search(guess[i]) == -1) {
                    misses += 1
                }
            }
            if (misses <= maxMisses) {
                return answer
            } else {
                return ""
            }
        }
        for (i = 0; i < 2; i++) {
            var string1 = orders[i][0];
            var string2 = orders[i][1];
            while (string1) {
                misses = Math.floor((Math.abs(string1.length - string2.length) + Math.abs(guess.length - answer.length)) / 2);
                var max = Math.min(string1.length, string2.length);
                for (j = 0; j < max; j++) {
                    var a = string2.charAt(j);
                    var b = string1.charAt(j);
                    if (a != b) misses += 1;
                    if (misses > maxMisses) break
                }
                if (misses <= maxMisses) return answer;
                string1 = string1.substr(1)
            }
        }
        return ""
    }
}

function getClozelangIds(e) {
    var t = e.id.slice(14);
    var n = t.indexOf(".");
    var r = t.slice(0, n);
    var i = t.slice(t.indexOf(".") + 1);
    return [r, i]
}

function showClozelangScore(ident, mark) {
    var showScore = eval(document.getElementById("clozelangFlag" + ident + ".showScore").value);
    if (showScore) {
        var score = 0;
        var div = document.getElementById("clozelang" + ident);
        var inputs = getCloseInputsCloze(ident);
        for (var i = 0; i < inputs.length; i++) {
            var input = inputs[i];
            if (mark) {
                var result = checkAndMarkClozelangWord(input)
            } else {
                var result = getClozelangMark(input)
            }
            if (result == 2) {
                score++
            }
        }
        var scorePara = document.getElementById("clozelangScore" + ident);
        scorePara.innerHTML = YOUR_SCORE_IS + score + "/" + inputs.length + "."
    }
}

function getCloseInputsCloze(e) {
    var t = new Array;
    var n = document.getElementById("clozelang" + e);
    recurseFindClozelangInputs(n, e, t);
    return t
}

function recurseFindClozelangInputs(e, t, n) {
    for (var r = 0; r < e.childNodes.length; r++) {
        var i = e.childNodes[r];
        if (i.id) {
            if (i.id.search("clozelangBlank" + t) == 0) {
                n.push(i);
                continue
            }
        }
        if (i.hasChildNodes()) {
            recurseFindClozelangInputs(i, t, n)
        }
    }
}

function toggleClozelangFeedback(e) {
    var t = document.getElementById("clozelangVar" + e + ".feedbackId");
    if (t) {
        var n = t.value;
        toggleElementVisible(n)
    }
}

NOT_ATTEMPTED = 0;
WRONG = 1;
CORRECT = 2;
NOT_ATTEMPTED = 0;
WRONG = 1;
CORRECT = 2;
sfHover = function() {
    var e = document.getElementById("siteNav");
    if (e) {
        var t = e.getElementsByTagName("LI");
        for (var n = 0; n < t.length; n++) {
            t[n].onmouseover = function() {
                this.className = "sfhover"
            };
            t[n].onmouseout = function() {
                this.className = "sfout"
            }
        }
        var r = e.getElementsByTagName("A");
        for (var n = 0; n < r.length; n++) {
            r[n].onfocus = function() {
                this.className += (this.className.length > 0 ? " " : "") + "sffocus";
                this.parentNode.className += (this.parentNode.className.length > 0 ? " " : "") + "sfhover";
                if (this.parentNode.parentNode.parentNode.nodeName == "LI") {
                    this.parentNode.parentNode.parentNode.className += (this.parentNode.parentNode.parentNode.className.length > 0 ? " " : "") + "sfhover";
                    if (this.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "LI") {
                        this.parentNode.parentNode.parentNode.parentNode.parentNode.className += (this.parentNode.parentNode.parentNode.parentNode.parentNode.className.length > 0 ? " " : "") + "sfhover"
                    }
                }
            };
            r[n].onblur = function() {
                this.className = this.className.replace(new RegExp("( ?|^)sffocus\\b"), "");
                this.parentNode.className = this.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
                if (this.parentNode.parentNode.parentNode.nodeName == "LI") {
                    this.parentNode.parentNode.parentNode.className = this.parentNode.parentNode.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"), "");
                    if (this.parentNode.parentNode.parentNode.parentNode.parentNode.nodeName == "LI") {
                        this.parentNode.parentNode.parentNode.parentNode.parentNode.className = this.parentNode.parentNode.parentNode.parentNode.parentNode.className.replace(new RegExp("( ?|^)sfhover\\b"), "")
                    }
                }
            }
        }
    }
};
if (document.addEventListener) {
    window.addEventListener("load", sfHover, false)
} else {
    window.attachEvent("onload", sfHover)
}
var ie_media_replace = function() {
    var e = document.getElementsByTagName("OBJECT");
    var t = e.length;
    while (t--) {
        if (e[t].type == "video/quicktime" || e[t].type == "audio/x-pn-realaudio-plugin") {
            if (typeof e.classid == "undefined") {
                e[t].style.display = "none";
                var n = "02BF25D5-8C17-4B23-BC80-D3488ABDDC6B";
                if (e[t].type == "audio/x-pn-realaudio-plugin") n = "CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA";
                var r = e[t].height;
                var i = e[t].width;
                var s = e[t].data;
                var o = document.createElement("DIV");
                o.innerHTML = '<object classid="clsid:' + n + '" data="' + s + '" width="' + i + '" height="' + r + '"><param name="controller" value="true" /><param name="src" value="' + s + '" /><param name="autoplay" value="false" /></object>';
                e[t].parentNode.insertBefore(o, e[t])
            }
        }
    }
};
if (navigator.appName == "Microsoft Internet Explorer") {
    if (document.addEventListener) {
        window.addEventListener("load", ie_media_replace, false)
    } else {
        window.attachEvent("onload", ie_media_replace)
    }
}
var $exe = {
    init: function() {
        var e = document.body.className;
        $exe.addRoles();
        if (e != "exe-single-page js") {
            var t = $exe.isIE();
            if (t) {
                if (t > 7) $exe.iDeviceToggler.init()
            } else $exe.iDeviceToggler.init()
        }
        if (e.indexOf("exe-epub3") != 0) {
            var n = document.body.innerHTML;
            if (n.indexOf(' class="mediaelement"') != -1 || n.indexOf(" class='mediaelement") != -1) {
                $exe.loadMediaPlayer.getPlayer()
            }
        }
        $exe.hint.init();
        $exe.setIframesProtocol();
        $exe.hasTooltips();
        if (typeof($.prettyPhoto) != 'undefined') $("a[rel^='lightbox']").prettyPhoto({
            social_tools: "",
            deeplinking: false,
            opacity: 0.95
        });
        $exe.dl.init()
    },
    rgb2hex: function(a) {
        if (/^#[0-9A-F]{6}$/i.test(a)) return a;
        a = a.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

        function hex(x) {
            return ("0" + parseInt(x).toString(16)).slice(-2)
        }
        return "#" + hex(a[1]) + hex(a[2]) + hex(a[3])
    },
    useBlackOrWhite: function(h) {
        var r = parseInt(h.substr(0, 2), 16);
        var g = parseInt(h.substr(2, 2), 16);
        var b = parseInt(h.substr(4, 2), 16);
        var y = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (y >= 128) ? 'black' : 'white'
    },
    dl: {
        init: function() {
            var l = $("dl.exe-dl");
            if (l.length == 0) return false;
            var h, e, t, bg, tc, s, id;
            l.each(function(i) {
                e = this;
                bg = $exe.rgb2hex($(e).css("color"));
                tc = $exe.useBlackOrWhite(bg.replace("#", ""));
                s = " style='text-decoration:none;background:" + bg + ";color:" + tc + "'";
                if (e.id == "") e.id = "exe-dl-" + i;
                id = e.id;
                $("dt", e).each(function() {
                    t = this;
                    h = $(t).html();
                    $(t).html("<span class='icon'" + s + ">» </span><a href='#' onclick='$exe.dl.toggle(this);return false' class='exe-dl-" + i + "-a'>" + h + "</a>")
                });
                $(e).before("<p class='exe-dl-toggler'><a href='#" + id + "' onclick='$exe.dl.toggle(\"show\",\"" + id + "\");return false;' title='" + $exe_i18n.show + "'" + s + ">+</a> <a href='#" + id + "' onclick='$exe.dl.toggle(\"hide\",\"" + id + "\");return false;' title='" + $exe_i18n.hide + "'" + s + ">-</a></p>")
            })
        },
        toggle: function(e, a) {
            if (e == "show") $("#" + a + " dd").show();
            else if (e == "hide") $("#" + a + " dd").hide();
            else $(e).parent().next("dd").toggle()
        }
    },
    hasTooltips: function() {
        if ($("A.exe-tooltip").length > 0) {
            var p = "";
            if (typeof(exe_editor_mode) != "undefined") p = "/scripts/exe_tooltips/";
            $exe.loadScript(p + "exe_tooltips.js", "$exe.tooltips.init('" + p + "')")
        }
    },
    addRoles: function() {
        $("#header").attr("role", "banner");
        $("#siteNav").attr("role", "navigation");
        $("#main").attr("role", "main");
        $("#siteFooter").attr("role", "contentinfo");
        $(".js-feedback").attr("role", "status")
    },
    isIE: function() {
        var e = navigator.userAgent.toLowerCase();
        return e.indexOf("msie") != -1 ? parseInt(e.split("msie")[1]) : false
    },
    imageGallery: {
        init: function(e) {
            $("A", "#" + e).attr("rel", "lightbox[" + e + "]")
        }
    },
    hint: {
        init: function() {
            $(".iDevice_hint").each(function(e) {
                var t = e + 1;
                var n = "hint-" + t;
                var r = $(".iDevice_hint_content", this);
                var i = $(".iDevice_hint_title", this);
                if (r.length == 1 && i.length == 1) {
                    r.eq(0).attr("id", n);
                    var s = i.eq(0);
                    var o = s.html();
                    s.html('<a href="#' + n + '" title="' + $exe_i18n.show + '" class="hint-toggler show-hint" id="toggle-' + n + '" onclick="$exe.hint.toggle(this);return false" style="background-image:url(' + $exe.hint.imgs[0] + ')">' + o + "</a>")
                }
            })
        },
        toggle: function(e) {
            var t = e.id.replace("toggle-", "");
            if (e.title == $exe_i18n.show) {
                $("#" + t).fadeIn("slow");
                e.title = $exe_i18n.hide;
                e.className = "hint-toggler hide-hint";
                e.style.backgroundImage = "url(" + $exe.hint.imgs[1] + ")"
            } else {
                $("#" + t).fadeOut();
                e.title = $exe_i18n.show;
                e.className = "hint-toggler show-hint";
                e.style.backgroundImage = "url(" + $exe.hint.imgs[0] + ")"
            }
        }
    },
    iDeviceToggler: {
        init: function() {
            if ($(".iDevice").length < 2) return false;
            var t = $(".iDevice_header,.iDevice.emphasis0");
            t.each(function() {
                var t = $exe_i18n.hide;
                e = $(this), c = e.hasClass("iDevice_header") ? "em1" : "em0", eP = e.parents(".iDevice_wrapper");
                if (eP.length) {
                    var n = '<p class="toggle-idevice toggle-' + c + '"><a href="#" onclick="$exe.iDeviceToggler.toggle(this,\'' + eP.attr("id") + "','" + c + '\')" title="' + t + '"><span>' + t + "</span></a></p>";
                    if (c == "em1") {
                        var r = e.html();
                        e.html(r + n)
                    } else e.before(n)
                }
            });
            $("INPUT.autocomplete-off").attr("autocomplete", "off")
        },
        toggle: function(e, t, n) {
            var r = $exe_i18n.hide;
            var i = $("#" + t);
            var s = ".iDevice_content";
            if (n == "em1") s = ".iDevice_inner";
            var o = $(s, i);
            var u = i.attr("class");
            if (typeof u == "undefined") return false;
            if (u.indexOf(" hidden-idevice") == -1) {
                r = $exe_i18n.show;
                u += " hidden-idevice";
                o.slideUp("fast");
                e.className = "show-idevice";
                e.title = r;
                e.innerHTML = "<span>" + r + "</span>"
            } else {
                u = u.replace(" hidden-idevice", "");
                o.slideDown("fast");
                e.className = "hide-idevice";
                e.title = r;
                e.innerHTML = "<span>" + r + "</span>"
            }
            i.attr("class", u)
        }
    },
    alignMediaElement: function(e) {
        var t = $(e);
        var n = t.parents().eq(2);
        var r = n.attr("class");
        if (typeof r == "string" && r.indexOf("mejs-container") == 0) {
            var i = e.style.marginLeft;
            var s = e.style.marginRight;
            if (i == "auto" && i == s) $(n).wrap('<div style="text-align:center"></div>')
        }
    },
    loadMediaPlayer: {
        getPlayer: function() {
            $exe.mediaelements = $(".mediaelement");
            $exe.mediaelements.each(function() {
                if (typeof this.localName != "undefined" && this.localName == "video") {
                    var e = this.width;
                    var t = $(window).width();
                    if (e > t) {
                        var n = t - 20;
                        var r = parseInt(this.height * n / e);
                        this.width = n;
                        this.height = r
                    }
                }
            }).hide();
            var e = "exe_media.js";
            if (typeof eXe != "undefined") {
                e = "../scripts/mediaelement/" + e
            }
            $exe.loadScript(e, "$exe.loadMediaPlayer.getCSS()")
        },
        getCSS: function() {
            var e = "exe_media.css";
            if (typeof eXe != "undefined") {
                e = "../scripts/mediaelement/" + e
            }
            $exe.loadScript(e, "$exe.loadMediaPlayer.init()")
        },
        init: function() {
            if (typeof eXe != "undefined") {
                mejs.MediaElementDefaults.flashName = "../scripts/mediaelement/" + mejs.MediaElementDefaults.flashName;
                mejs.MediaElementDefaults.silverlightName = "../scripts/mediaelement/" + mejs.MediaElementDefaults.silverlightName
            }
            $exe.mediaelements.mediaelementplayer().show().each(function() {
                $exe.alignMediaElement(this)
            })
        }
    },
    setIframesProtocol: function() {
        var e = window.location.protocol;
        var t = false;
        if (e != "http" && e != "https") t = true;
        $("IFRAME").each(function() {
            var e = $(this).attr("src");
            if (t && e.indexOf("//") == 0) $(this).attr("src", "http:" + e)
        })
    },
    loadScript: function(url, callback) {
        var s;
        if (url.split(".").pop() == "css") {
            s = document.createElement("link");
            s.type = "text/css";
            s.rel = "stylesheet";
            s.href = url
        } else {
            s = document.createElement("script");
            s.type = "text/javascript";
            s.src = url
        }
        if (s.readyState) {
            s.onreadystatechange = function() {
                if (s.readyState == "loaded" || s.readyState == "complete") {
                    s.onreadystatechange = null;
                    if (callback) eval(callback)
                }
            }
        } else {
            s.onload = function() {
                if (callback) eval(callback)
            }
        }
        document.getElementsByTagName("head")[0].appendChild(s)
    },
    toggleFeedback: function(e, b) {
        var t = e.name.replace("toggle-", "");
        var n = document.getElementById(t);
        var d = false;
        var r = window[t.replace("-", "") + "text"];
        if (typeof(r) != 'undefined') {
            r = r.split("|");
            if (r.length > 1) d = true
        }
        if (n) {
            if (n.className == "feedback js-feedback js-hidden") {
                n.className = "feedback js-feedback";
                if (b) e.value = $exe_i18n.hideFeedback;
                else if (d) e.value = r[1]
            } else {
                n.className = "feedback js-feedback js-hidden";
                if (b) e.value = $exe_i18n.showFeedback;
                else if (d) e.value = r[0]
            }
        }
    }
};
if (typeof jQuery != "undefined") {
    $(function() {
        $exe.init()
    })
}