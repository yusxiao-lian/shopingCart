var myself ={};

myself.localData = function(key){
    var localpro = JSON.parse(localStorage.getItem(key));
    if(localpro === null){
        localpro = [];
    }
    return localpro;
}

