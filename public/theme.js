const them_mode =document.querySelector(".theme_mode")
const btn_mode =document.querySelector(".theme-switch")
// them_mode.setAttribute("theme",them_mode.getAttribute("theme"))
// console.log(btn_mode)
if(sessionStorage.getItem("theme")!==null){
    them_mode.setAttribute("theme",sessionStorage.getItem("theme"))
}
window.sessionStorage.setItem("theme",them_mode.getAttribute("theme"))
btn_mode.addEventListener('click',()=>{
    if(sessionStorage.getItem("theme")===null){
        sessionStorage.setItem("theme","dark")
        console.log(sessionStorage.getItem("theme"))
       
    }else{
        sessionStorage.setItem("theme",sessionStorage.getItem("theme")=="dark"? "light":"dark")
        
    }
    // const mode =them_mode.getAttribute('theme')=="dark"?"light":"dark"
    them_mode.setAttribute("theme",sessionStorage.getItem("theme"))
    // sessionStorage.getItem("theme")
    console.log(sessionStorage.getItem("theme"))
    
   
})

const timeUnit =["days","hours","minutes"][1]
console.log(timeUnit)
