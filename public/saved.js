import { getTime,Notification } from "./module.js"




const gridList =document.querySelector('.grid-list')
const article =document.querySelector('.saved-page')
const filterContent =document.querySelector('.grid-list')
if(filterContent.clientHeight>=300){
    const height_FilterBar =filterContent.clientHeight
    article.style.height =`${height_FilterBar+100}px`
    console.log(height_FilterBar)
}else{
    article.style.height =`400px`
}


const recipeIdArray =Object.keys(window.localStorage)
if(recipeIdArray.length!=0){
    recipeIdArray.forEach((value,index)=>{
        const {recipe:
            {image,label,totalTime,uri}
        
        } =JSON.parse(localStorage.getItem(value))
        const recipeId =uri.slice(uri.lastIndexOf("_")+1)
                   
        const isSaved =window.localStorage.getItem(`detail_${recipeId}`)
        
        const card =document.createElement('div')
        card.classList.add('card')
        card.innerHTML =`
            <figure class="card-media img-holder">
                <img src=${image} width="200" height="200" loading="lazy" alt="" class="img-cover">
            </figure>
            <div class="card-body">
                <h3 class="title-small">
                    <a href="/detail?recipe=${recipeId}" class="card-link">${label}</a>
                </h3>
                <div class="meta-wrapper">
                    <div class="meta-item">
                        <span class="material-symbols-outlined"
                        aria-hidden="true">
                            <i class='bx bx-stopwatch'></i>
                        </span>
                        <span class="label-medium">${getTime(totalTime).time} ${getTime(totalTime).timeUnit}</span>
                    </div>
                    <button class="icon-btn has-state ${isSaved?"saved":"removed"}" aria-label="Add to saved recipes" id="btn_bookmark" onclick="FetchDateById(this,'${recipeId}')">
                        <span class="material-symbols-outlined bookmark-add" aria-hidden="true">
                            <i class='bx bx-bookmark-plus' ></i>
                        </span>
                        <span class="material-symbols-outlined bookmark" aria-hidden="true">
                            <i class='bx bxs-bookmark'></i>
                        </span>
                    </button>
                </div>
            
            </div>`
        
        
        gridList.appendChild(card)

        if(filterContent.clientHeight>=300){
            const height_FilterBar =filterContent.clientHeight
            article.style.height =`${height_FilterBar+100}px`
            console.log(height_FilterBar)
        }else{
            article.style.height =`400px`
        }
    })
}else{
    gridList.innerHTML=`<p>Nothing in saved-recipes list</p>`
}

window.FetchDateById =async(tag,recipeId)=>{
    // if class name is removed then it's change into saved,otherwise
    tag.classList.toggle("removed")
    tag.classList.toggle("saved")
    // console.log(recipeId)
    const uri_ID =`https://api.edamam.com/api/recipes/v2/${recipeId}?app_id=e01c42d8&app_key=19a34826099c7e0c9666127afe12981b&type=public`
    const response = await fetch(uri_ID)
    const data =await response.json()
    const isSave =window.localStorage.getItem(`detail_${recipeId}`)  //underfind or string
    if(!isSave){
        Notification("Added to Recipe book")
        window.localStorage.setItem(`detail_${recipeId}`,JSON.stringify(data))

        
    }else{
        Notification("Removed from Recipe book")
        window.localStorage.removeItem(`detail_${recipeId}`)
    
    }
    


}