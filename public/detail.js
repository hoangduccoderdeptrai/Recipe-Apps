import { skeletonCard,getTime,Notification } from "./module.js"

const detailPage =document.querySelector(`[data-detail-container]`)
const fetchDetail =()=>{
    const id =window.location.search.slice(window.location.search.indexOf('=')+1)
    console.log(id)
    let uri=`https://api.edamam.com/api/recipes/v2/${id}?type=public&app_id=e01c42d8&app_key=19a34826099c7e0c9666127afe12981b`
    
    fetch(uri).then(
        (data)=>{
            return data.json()
        }
    ).then(
        (data)=>{
            console.log(data.recipe)
            const {images:{LARGE,REGULAR,SMALL,THUMBNAIL}} =data.recipe
            const {ingredientLines,healthLabels,source:author,label,totalTime,calories,uri,yield:servings=0}=data.recipe
            const recipeId =uri.slice(uri.lastIndexOf('_')+1)
            const isSaved =localStorage.getItem(`detail_${recipeId}`)

            const imageDetail =LARGE||REGULAR||SMALL||THUMBNAIL //maybe using LARGE??REGULAR??SMALL??THUMBNAIL ,both is the same
            const {url:urlImage,width,height}=imageDetail
            var ingrList=""
            var healthList =""
            healthLabels.map(value=>{
                healthList+=` <a href="/recipes?health=${value.toLowerCase().replace(/%20/g," ")}" class="badge-btn body-medium has-state">${value}</a>`
            })
            ingredientLines.map(value=>{
                ingrList+=`<li class="ingr-item">${value}</li>`
            })
            detailPage.innerHTML =`
                <figure class="detail-banner img-holder">
                    <img src=${urlImage} width="${width}" height="${height}" class="img-cover">
                </figure>
                <div class="detail-content">
                    <div class="title-detail">
                        <h1 class="display-small">${label}</h1>
                    
                        <button class="icon-btn has-state ${isSaved?"saved":"removed"}" aria-label="Add to saved recipes" id="btn_bookmark" onclick="FetchDateById(this,'${recipeId}')">
                            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">
                                <i class='bx bx-bookmark-plus' ></i>
                            </span>
                            <span class="material-symbols-outlined bookmark" aria-hidden="true">
                                <i class='bx bxs-bookmark'></i>
                            </span>
                            <span class="label-large save-text">Save</span>
                            <span class="label-large unsaved-text">Unsaved</span>
                        </button>
                    
                    </div>
                    <div class="detail-author label-large">
                        <span class="span">by</span>${author}
                    </div>
                    <div class="detail-stats">
                        <div class="stats-item">
                            <span class="display-medium">${ingredientLines.length}</span>
                            <span class="label-medium">Ingredients</span>
                        </div>
                        <div class="stats-item">
                            <span class="display-medium">${getTime(totalTime).time}</span>
                            <span class="label-medium">${getTime(totalTime).timeUnit}</span>
                        </div>
                        <div class="stats-item">
                            <span class="display-medium">${Math.floor(calories)}</span>
                            <span class="label-medium">Colories</span>
                        </div>
                    </div>
                    <div class="tag-list">
                       ${healthList}


                    </div>
                    <h2 class="title-medium ingr-title">Ingredients
                        <span class="label-medium">for ${servings} Servings</span>
                    </h2>
                    <ul class="body-large ingr-list">
                        ${ingrList}

                    </ul>
                </div>
            `
            
        }
    ).catch(err=>{
        console.log(err.message)
    })
}
fetchDetail()

window.FetchDateById =async(tag,recipeId)=>{
    // if class name is removed then it's change into saved,otherwise
    tag.classList.toggle("removed")
    tag.classList.toggle("saved")
    console.log(recipeId)
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