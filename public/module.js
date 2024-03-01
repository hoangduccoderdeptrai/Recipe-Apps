
export const getTime =(minutes)=>{
    const hours =Math.floor(minutes/60)
    const days =Math.floor(hours/24)
    const time = days||hours||minutes
    const time_index =[days,hours,minutes].lastIndexOf(time)  //if time =0 then time_index =2(minutes)
    const timeUnit =["days","hours","minutes"][time_index]
    return {time,timeUnit}
}


export const skeletonCard =`
<div class="card skeleton-card">
    <div class="skeleton card-banner"></div>
    <div class="card-body">
        <div class="skeleton card-title"></div>
        <div class="skeleton card-text"></div>
    </div>
</div>
`

export function Notification(message){
    const info =document.querySelector(".info")
    const notice =document.createElement('div')
    notice.classList.add("notification")
    notice.innerHTML =`
        <p>${message}</p>
    `
    info.appendChild(notice)

    notice.addEventListener("animationend",(e)=>{
        info.removeChild(notice)
    })
}


