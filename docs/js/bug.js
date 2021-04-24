/////////////////////////////////////////UTILITY//////////////////////////////////////////
$ = (sel) => document.getElementById(sel);
$$ = (sel) => document.getElementsByClassName(sel);
chooseOne = (a) => a[ Math.floor(Math.random()*a.length) ]
//////////////////////////////////////////////////////////////////////////////
// Do some action with thing or array of thing, depending on what it is
function oneRmany(thing, func){
	if(typeof(thing) == "string"){ func(thing); }
	else for(var i = 0; i < thing.length; i++) func(thing[i]);
}
//////////////////////////////////////////////////////////////////////////////////////////
// https://www.npmjs.com/package/serve
// C:\Users\ASUS\AppData\Roaming\npm-cache\_npx\4348
//////////////////////////////////////////////////////////////////////////////////////////
var comp = {}
//////////////////////////////////////////////////////////////////////////////////////////
// Load one bugs from file.
//////////////////////////////////////////////////////////////////////////////////////////
function loadBugs(names, callback){
	if(typeof(names) == "string") names = [names];

	Promise.all(names.map(name => 
		fetch(name).then((response) => { return response.text(); })  )) //.then((html) => {console.log(html)});
		.then((html) => {  
		    var parser = new DOMParser(); // Convert HTML string to document object
		    var doc = parser.parseFromString(html, 'text/html');
			var components = doc.querySelectorAll('[data-bug]');

		    for(var i = components.length - 1; i >= 0; i--){
		    	var name = components[i].getAttribute("data-bug");
		    	comp[name] = components[i].outerHTML;		    		
		    }
		callback()
	});
}
//////////////////////////////////////////////////////////////////////////////
function build(what, where, callback){
	$(where).innerHTML = ''
	oneRmany(what, function (x) { 
		$(where).innerHTML += generateTemplate(comp[x])
	});

	//callback()
}		
//////////////////////////////////////////////////////////////////////////////
function add(what, where){
	oneRmany(what, function (x) { 
		$(where).innerHTML += generateTemplate(comp[x])
	});
}
//////////////////////////////////////////////////////////////////////////////
function generateTemplate(x, data){
	var res = x.split(/(\{\{[^|}]*)\}\}/);
	if(res.length == 1){
		return x;
	}else{
		var str = ''
		for (var i = 0; i < res.length; i++) {
			if(res[i][0]=='{' && res[i][1]=='{'){
				var value = res[i].slice(2)
				var FOR = value.split(/\s*for\s*/)
				if(FOR.length>1){
					for(var i = 0; i < comp[FOR[1]].length; i++){					
						str += generateTemplate(comp[FOR[0]], comp[FOR[1]][i])
					}
				}else if(typeof(data)=='string'){
					str += data; // 
				}else if(typeof(data)=='object'){
					// TODO: get object data and insert only the value that 
					//       goes in this spot.
					// Warning: data could be nested!
					str += data[value]; // 
				}
			}else{ 
				str += res[i]; // 
			}				
		}
		return str
	}
}

// x = `This is some text {something}. But there is {{some.thing}} that needs inserted.`
// x.split(/(\{\{[^|}]*)\}\}/);
// res: (3) ["This is some text {something}. But there is ", "{{some.thing", " that needs inserted."]



// x = `card for thing`
// x.split(/\s*for\s*/)

