// SHOW RECIPES IN RECIPES PAGE

import { skeletonCard,getTime,Notification } from "./module.js"
// 
const home_recipes =document.querySelectorAll('.navbar-link')
home_recipes[1].classList.add('active')
home_recipes.forEach(value=>{
    value.addEventListener('click',()=>{
        home_recipes.forEach(values=>{
            if(values.classList.contains('active')){
                values.classList.remove('active')
            }else{
                values.classList.add('active')
            }
        })
    })
})


var btn =document.querySelectorAll('[data-accordion-btn]')
const article =document.querySelector('.recipe-page')
btn =Array.from(btn)
// ROTATE chevron-down
btn.forEach((value)=>{
    value.addEventListener("click",()=>{
        let isExpanded =value.getAttribute('aria-expanded')
        console.log(isExpanded)
        isExpanded =isExpanded=='true' ? 'false':'true'
        value.setAttribute('aria-expanded',isExpanded)
        // const filterBar =document.querySelector('.filter-bar')
        // const height_FilterBar =filterBar.clientHeight
        // article.style.height =`${height_FilterBar}px`
        // console.log(height_FilterBar)



    })
})




// TOGGLER

const filterBar =document.querySelector('[data-filter-bar]')
const filterTogglers =document.querySelectorAll('[data-filter-toggler]')
const btnFilter =document.querySelector('.btn-filter')
console.log(filterTogglers)
filterTogglers.forEach(element=>{
    element.addEventListener("click",()=>{
        filterBar.classList.toggle('active')
        if(filterBar.classList.contains('active')){
            btnFilter.style.zIndex=-1
        }else{
            btnFilter.style.zIndex=1
        }
    })
    
})

// FILTER SUBMIT AND CLEAR

const filterSubmit =document.querySelector('[data-filter-submit]')
const filterClear =document.querySelector('[data-filter-clear]')
const filterSearch =document.querySelector('input[type=search]')
let isSubmit=false
filterSubmit.addEventListener('click',(e)=>{
    isSubmit=true
    const checkboxes =document.querySelectorAll('input:checked')
    console.log(checkboxes)
    const queries =[]
    if(filterSearch.value){
        let value_input =String(filterSearch.value).trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace("đ",'d')
        queries.push(['q',value_input])
    }
    if(checkboxes.length!=0){
        checkboxes.forEach((values)=>{
            console.log(values.parentElement.parentElement,values.parentElement.parentElement.getAttribute('data-filter'))
            const key =values.parentElement.parentElement.getAttribute('data-filter')
            queries.push([key,values.value])
        })
    }
   
    let value_query =queries.join('&').replace(/,/g,"=")
    window.location =queries.length?`/recipes?${value_query}`:'/recipes'
})

filterSearch.addEventListener("keydown",(e)=>{
    if(e.key=="Enter")filterSubmit.click()
})

// CLEAR
filterClear.addEventListener('click',()=>{
    const checkboxes =document.querySelectorAll('input:checked')
    if(checkboxes.length!=0){
        checkboxes.forEach(element=>{
            element.checked =false
        })
    }
    filterSearch.value=""
})

const queryStr =window.location.search.slice(1)
const badge =document.querySelector('.badge')
const query =queryStr.split('&').map(i=>{return i.split("=")})
if(query.length &&query[0]!=''){
    badge.style.display='block'
    badge.innerHTML=query.length
}else{
    badge.style.display='none'
}

queryStr&&query.forEach((value,index)=>{
    if(index==0 &&value[0]=='q'){
        filterSearch.value =value[1].replace(/%20/g," ")
    }else{
        const dataFilter =document.querySelector(`[data-filter="${value[0]}"]`)
        console.log(dataFilter)
        if(dataFilter !=null)
            dataFilter.querySelector(`[value="${value[1]}"]`).checked=true
    }
})

// move data-filter-button
const filterBtn =document.querySelector('[data-filter-btn]')
window.addEventListener('scroll',(e)=>{
    if(window.scrollY>120){
        filterBtn.classList.add('active')
        filterBtn.style.zIndex=1
    }else{
        filterBtn.classList.remove('active')
    }
})

// GRID CONTAINER

const gridList =document.querySelector('.grid-list')
const loadmore =document.querySelector('.load-more')
let nextPage =""
let requestedBefore =true

const filterContent =document.querySelector('.grid-list')
// if(filterContent.clientHeight>=300){
//     const height_FilterBar =filterContent.clientHeight
//     article.style.height =`${height_FilterBar+100}px`
//     console.log(height_FilterBar)
// }else{
//     article.style.height =`500px`
// }

// article.style.height =`500px`

//FETCH GRID-FILTER
const rederRecipes =async()=>{
   
    // gridList.innerHTML =skeletonCard.repeat(10)
    gridList.innerHTML+=`${skeletonCard.repeat(10)}`
    let Str =queryStr.replace(/%20/g," ")
    article.style.height =`1200px`
    let url=""
    if(nextPage!="" ||nextPage){
      
        url =nextPage
    }else{
      
        url =`https://api.edamam.com/api/recipes/v2?app_id=e01c42d8&app_key=19a34826099c7e0c9666127afe12981b&type=public&${Str}`
    }
    console.log(url)
    fetch(url).then(
        (data)=>{
           return  data.json()
        }
    ).then(
        (data)=>{

            const{_links:{next}}=data
            
            nextPage =next?.href   //nextPage =next?next.href:undefined
            console.log(data.hits.length)
            if(data.hits.length!=0){
                for(let i=0;i<10;i++){
                    gridList.removeChild(gridList.lastElementChild)
                }
                const dataArray =data.hits
                dataArray.forEach(element=>{
                    console.log(element)
                    const {recipe:
                        {image,label,totalTime,uri}
                    
                    } =element
                   
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
                })
              
               
            }else{
                for(let i=0;i<10;i++){
                    gridList.removeChild(gridList.lastElementChild)
                }
                
                if(Str.length==0){
                    gridList.innerHTML=""
                    loadmore.innerHTML =`<p class="info-text">
                        All health content on duclehoangcoder.com is provided for general information only,
                        and should not be treated as a substitute for the medical advice of your own doctor or any other health care professional.
                        If you have any concerns about your general health, you should contact your local health care provider.
                    </p>`
                }else{
                    gridList.innerHTML=""
                    loadmore.innerHTML =`<p class="info-text">No recipe found</p>`
                }
               
            }

            if(filterContent.clientHeight>=300){
                const height_FilterBar =filterContent.clientHeight
                article.style.height =`${height_FilterBar+100}px`
                // console.log(height_FilterBar)
            }else{
                article.style.height =`500px`
            }
            requestedBefore=false
            
        }
       
        
        
    ).catch((err)=>{console.log(err.message)})
}
rederRecipes(nextPage)



// Fetch data by RecipesId WHEN we press saved button or removed bnt
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

// NOTIFICATION
// const info =document.querySelector(".info")
// function Notification(message){
//     const info =document.querySelector(".info")
//     const notice =document.createElement('div')
//     notice.classList.add("notification")
//     notice.innerHTML =`
//         <p>${message}</p>
//     `
//     info.appendChild(notice)

//     notice.addEventListener("animationend",(e)=>{
//         info.removeChild(notice)
//     })
// }


let dem =0
window.addEventListener('scroll',async(e)=>{
    e.preventDefault()
    console.log(loadmore.getBoundingClientRect().top,window.innerHeight,)
    // console.log(requestedBefore,nextPage)
    // loadmore.innerHTML =skeletonCard.repeat(12)
    if(dem>=5){
        loadmore.innerHTML =`<p class="info-text">No Show More</p>`
        return 
    }
    if(loadmore.getBoundingClientRect().top<window.innerHeight&& !requestedBefore &&nextPage){
        console.log("du dieu kien")
        requestedBefore=true
        await rederRecipes()
        dem++
       

    }
})
