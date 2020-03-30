var thirds = document.getElementsByClassName("column third");

var biggestElement = 0;
for(var i = 0; i < thirds.length; i++){
    if(thirds[i].clientHeight > biggestElement){
        biggestElement = thirds[i].clientHeight;
    }
}
for(var i = 0; i < thirds.length; i++){
    thirds[i].style.height = biggestElement + "px";
}
