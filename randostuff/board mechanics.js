const doc= document.getElementById

function start(){
  console.log("start")
    doc("3").addEventListener("click", function(){beep("full");});
    printclass("3", "full")
}

function beep(x){
    doc("3").setAttribute("class", x)
    console.log("beep")
}
function printclass(x, y) {
    doc(x).className = y;
    console.log("printclass")
  }
  
  function print(x, y) {
    doc(x).innerHTML = y;
  }

  window.onload=start