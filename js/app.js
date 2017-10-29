function updateCode(code) {
    if (!code) return;
    var scr = `
                    try{
                        ${code}
                        
                    }catch(e){
                        console.log(e);
                        console.log(e.stack);  
                    }
            `;
    var script = document.createElement("script");
    script.innerHTML = scr;
    try {
        document.head.appendChild(script)
    } catch (e) {
        debugger
    }
}

function run(name, propsstr) {
    let props;
    eval("props=" + (propsstr || "{}"));
    ReactDOM.render(
        React.createElement("div"),
        document.getElementById('app')
    );

    try {
        ReactDOM.render(
            React.createElement(Klasses[name], props),
            document.getElementById('app')
        )
    } catch (e) {
        debugger
    }
}

function updateStyle(css, code) {

    css = "style" + css;
    if (!this[css]) {
        var script = document.createElement("style");
        script.id = css;
        document.head.appendChild(script);
    }
    this[css].innerHTML = code;
}

function updateMethods(name, obj) {
    if (!Klasses[name]) {

        Klasses[name] = React.createClass({
            getInitialState: function() {
                return {}
            },
            render: function() {
                return null
            }
        });
    }
    for (var k in obj) {
        try {
            if (k === 'render') Klasses[name].prototype.render = Function(obj[k]);
            else Klasses[name].prototype[k] = Function.apply(Function, obj[k]);


        } catch (e) {
            console.error(k, e, obj[k]);
            window.openFromView && window.openFromView("log", [e.message]);
        }
    }
}

const Klasses = {};


//=========================================================================================================
function updateSelect(nodeid) {
    var sides = ["Left", "Right", "Bottom", "Top"];
    if (!nodeid) {
        if (inspector) inspector.style.display = "none";
        if (window.elSelected) {
            window.elSelected.style.outline = null;
            window.elSelected = null;
        }
        return;
    }
    var el = document.querySelector('[data-tid="' + nodeid + '"]')
    if (window.elSelected === el) {
        return;
    } else if (window.elSelected) window.elSelected.style.outline = null;
    if (!el) return;
    var r = el.getBoundingClientRect();
    var cs = getComputedStyle(el);
    var w = r.width;
    var h = r.height;
    var t = r.top;
    var l = r.left;
    if (inspector) {
        for (var o of sides) {
            var p = parseFloat(cs["padding" + o]);
            var b = parseFloat(cs["border" + o + "Width"]);
            inspector.style["border" + o + "Width"] = p + "px";
            if (o === "Top" || o === "Bottom") {
                h -= (p + b);
                if (o === "Top") t += b;
            } else {
                if (o === "Left") l += b;
                w -= (p + b);
            }
        }
        inspector.style.width = w + "px";
        inspector.style.height = h + "px";
        inspector.style.top = t + "px";
        inspector.style.left = l + "px";
        inspector.style.display = "block";
    }
    el.style.outline = "1px solid #0091cc"
    window.elSelected = el;
}

function $print() {
    window.openFromView && window.openFromView("log", arguments, Klasses)
}

let oldHTMLFocus = HTMLElement.prototype.focus;
HTMLElement.prototype.focus = function() {
    if (!window.canFocus) return;
    oldHTMLFocus.apply(this, arguments);
};


console.log("App ready!!!")

var inspector = document.getElementById('inspector');