
import { getTime,skeletonCard,Notification} from "./module.js"


// Toogles between Home and Recipes
const home_recipes =document.querySelectorAll('.navbar-link')
home_recipes[0].classList.add('active')
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


// SEARCH
const input_search =document.querySelector("[input-field]")
const btn_search =document.querySelector(".search-submit")

btn_search.addEventListener("click",(e)=>{
    e.preventDefault()
    if(input_search.value){
        let value =String(input_search.value).trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(new RegExp(" ","g"),"-").replace("đ",'d')
        
        window.location.href=`/recipes?q=${value}`
    }
})

input_search.addEventListener("keydown",(e)=>{
   
    if(e.key==="Enter"){
        btn_search.click()
    }
})


// NAVIGATE TAB 

const tabList =document.querySelector(".tab-list")
const tabPanel =document.querySelectorAll(".tab-panel")
tabList.addEventListener('click',(e)=>{
    //tab-btn
    const tag =e.target
    set_tabList_selected(tabList.children)
    tag.setAttribute("aria-selected","true")
    const aria_control=tag.getAttribute("aria-controls")

    //tab-panel
    add_hidden(tabPanel,aria_control)
    let TabPanel_Id =document.querySelector(`#${aria_control}`)


    const length_Card =TabPanel_Id.children.length
    // if length_card> 0,we don't need to load data anymore
    if(length_Card==0)
        fetch_data(aria_control,tag.innerHTML)
    
    // console.log(tag,aria_control)
})
// set aria-selected property of tab-btn to false
function set_tabList_selected(array){
    array =Array.from(array)
    array.forEach(element => {
        element.setAttribute("aria-selected","false")
    });
}
function add_hidden(array,aria_control){
    array =Array.from(array)
    array.forEach(element=>{
        element.setAttribute("hidden","")
        if(element.id==aria_control){
            element.removeAttribute("hidden")
        }
    })
}



// FETCH DATA FOR TAB NAV
async function fetch_data(id_element,name){
    const TabPanel =document.querySelector(`#${id_element}`)
    TabPanel.innerHTML=`
        <div class="grid-list">
            ${skeletonCard.repeat(20)}
        </div>
    `
    const gridList =document.createElement('div')
    gridList.classList.add('grid-list')


    name =name.trim().toLowerCase()
    // const url =`https://api.edamam.com/search?q=${name}&app_id=e01c42d8&app_key=19a34826099c7e0c9666127afe12981b`
    const url =`https://api.edamam.com/api/recipes/v2?app_id=e01c42d8&app_key=19a34826099c7e0c9666127afe12981b&type=public&q=${name}`
    const response = await fetch(url)
   
    const data = await response.json()
   
    // console.log(data.hits)
    const array_data =data.hits
    for(let i=0;i<array_data.length;i++){
        const {
            recipe:{
                image,label,totalTime,uri
            }
        }=array_data[i]   

        const recipeId =uri.slice(uri.lastIndexOf("_")+1)
        const isSaved =window.localStorage.getItem(`detail_${recipeId}`)

        
        const card =document.createElement('div')
        card.classList.add('card')
        card.style.animationDelay =`${100*i}ms`
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
                    <button class="icon-btn has-state  ${isSaved?"saved":"removed"} " aria-label="Add to saved recipes" id="btn_bookmark" onclick="FetchDateById(this,'${recipeId}')">
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
    }
    gridList.innerHTML+=`
    <div class="card skeleton-card">
        <div class="skeleton card-banner"></div>
        <div class="card-body">
            <div class="skeleton card-title"></div>
            <div class="skeleton card-text"></div>
        </div>
    </div>
`
    TabPanel.innerHTML=""
    TabPanel.appendChild(gridList)
    TabPanel.innerHTML+=`<p class="btn btn-secondary label-large has-state"  id=${name}>Show more</p>`

    console.log(TabPanel.children[1].id)
    const showmore= document.querySelector(`#${TabPanel.children[1].id}`)

    showmore.addEventListener("click",async()=>{
        await showmore1(name,id_element,gridList)
    })
    // mark()


    
    
}
fetch_data('panel-1','breakfast')


// SHOW MORE OR
async function showmore1(name,id_element,gridList){
    const lengGridList =gridList.children.length
    console.log(lengGridList)
    
    gridList.innerHTML+=`${skeletonCard.repeat(5)}`
    const TabPanel =document.querySelector(`#${id_element}`)
    TabPanel.innerHTML=""
    const url =`https://api.edamam.com/api/recipes/v2?app_id=e01c42d8&app_key=19a34826099c7e0c9666127afe12981b&type=public&mealType=${name}`
    const response = await fetch(url)
    const data = await response.json()
    
   
    const array_data =data.hits
    //delete skeleton(we have 6)
    for(let i=0;i<6;i++){
        gridList.removeChild(gridList.lastElementChild)
    }
    
    for(let i=0;i<array_data.length;i++){
        const {
            recipe:{
                image,label,totalTime,uri
            }
        }=array_data[i]  
        const recipeId =uri.slice(uri.lastIndexOf("_")+1)
        const isSaved =window.localStorage.getItem(`detail_${recipeId}`)
        
        const card =document.createElement('div')
        card.classList.add('card')
        card.style.animationDelay =`${100*i}ms`
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
                    <button class="icon-btn has-state removed ${isSaved?"saved":"removed"}" aria-label="Add to saved recipes" id="btn_bookmark" onclick="FetchDateById(this,'${recipeId}')">
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
    }
    TabPanel.appendChild(gridList)

    
}



const dragging =(e)=>{
   
    if(isMouseDown==false)return
  
    e.preventDefault()
    // console.log(SliderAsian.scrollWidth,SliderAsian.clientWidth,SliderAsian.scrollLeft)
    // console.log({"pageX":e.pageX,"pageY":e.pageY})
    let distanceSlide =e.pageX-prePageX
    let choose =e.target.parentElement.parentElement.parentElement.parentElement.parentElement
    if(choose.classList.contains("asian"))
        SliderAsian.scrollLeft=preScrollLeft -distanceSlide
    else if(choose.classList.contains("french")){
        SliderFrench.scrollLeft=preScrollLeft-distanceSlide
    }
    
}
const mouseDown=(e)=>{
    isMouseDown=true
    e.preventDefault()
    prePageX =e.pageX
    preScrollLeft =SliderAsian.scrollLeft
    let choose =e.target.parentElement.parentElement.parentElement.parentElement.parentElement
    if(choose.classList.contains("asian"))
        preScrollLeft =SliderAsian.scrollLeft
    else if(choose.classList.contains("french")){
        preScrollLeft =SliderFrench.scrollLeft
    }
  
}

const mouseUp =(e)=>{
    isMouseDown=false
    e.preventDefault()
}

// Slider image Asian
let isMouseDown =false,prePageX,preScrollLeft
const SliderAsian =document.querySelector(".asian")
SliderAsian.addEventListener("mousemove",dragging)
SliderAsian.addEventListener("mousedown",mouseDown)
SliderAsian.addEventListener("mouseup",mouseUp)

// Slider image French
const SliderFrench =document.querySelector(".french")
SliderFrench.addEventListener("mousemove",dragging)
SliderFrench.addEventListener("mousedown",mouseDown)
SliderFrench.addEventListener("mouseup",mouseUp)


// Fetch data by RecipesId WHEN we press saved button or removed bnt
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
// window.check =(element,recipeId)=>{
//     console.log("cc nhe")
//     console.log(recipeId)
// }

// localStorage.removeItem('detail_undefined')

// Fetch data for ASIAN FOOD AND FRENCH FOOD
const sliderCardArray =document.querySelectorAll(".slider")
const array_country_food =["asian","french"]
const route_recipe =['/recipeasianAPI','/recipefrenchAPI']
const array_class_slider =["slider-asian","slider-french"]


sliderCardArray.forEach((element,index)=>{
    // const uri =`https://api.edamam.com/api/recipes/v2?app_id=e01c42d8&app_key=19a34826099c7e0c9666127afe12981b&type=public&q=${array_country_food[index]}`
    const uri =`${route_recipe[index]}`
    element.innerHTML=`
        <ul class="slider-wrapper" data-slider-wrapper>
            ${`<li class="slider-item">${skeletonCard}</li>`.repeat(10)}
        </ul>
    `

    fetch(uri).then(
        (data)=>{
            return data.json()
        }
    ).then(data=>{
        element.innerHTML =`
        <button class="left-sider">
            <i class='bx bx-chevron-left'></i>
        </button>
        `
       
        const array_data =data
        const card =document.createElement('ul')
        card.classList.add('slider-wrapper')
        card.classList.add(array_class_slider[index])
        card.setAttribute("data-slider-wrapper","")
        card.innerHTML=""
    
        for(let i=0;i<array_data.length;i++){
            const {
               
                image,label,totalTime,uri
               
            }=array_data[i]  
            const recipeId =uri.slice(uri.lastIndexOf("_")+1)
            const isSaved =window.localStorage.getItem(`detail_${recipeId}`)
            
            // const card =document.createElement('ul')
            // card.classList.add('slider-wrapper')
            // card.setAttribute("data-slider-wrapper","")
            // card.innerHTML=""
            // card.style.animationDelay =`${100*i}ms`
            card.innerHTML +=`
                <li class="slider-item">
                    <div class="card">
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
                        
                        </div>
                    </div>
                </li>`
                
            
           
        }
        // element.innerHTML=""
        element.appendChild(card)
        element.innerHTML+=`
        <button class="right-sider">
            <i class='bx bx-chevron-right'></i>
        </button>
        `
        slider()
    })
    .catch(err=>{
        console.log(err.message)
    })

    
})



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

const upto =document.querySelector('.scroll-top')
const sliderSection =document.querySelector('.slider-section')
// console.log(upto.getBoundingClientRect().top,window.innerHeight)


window.addEventListener('scroll',()=>{
    if(window.scrollY>450){
        upto.classList.add('active')
    }else{
        upto.classList.remove('active')
    }
})

upto.addEventListener('click',(e)=>{
    console.log("ccc")
    window.scrollTo({top:0, behavior:'smooth'})

})

// SLIDER MOVE
function slider(){
    const sliderWrapperAsian =document.querySelector('.asian')
    const sliderWrapperFrench =document.querySelector('.french')
    const leftSliderArray =document.querySelectorAll('.left-sider')
    const rightSliderArray =document.querySelectorAll('.right-sider')
    // console.log(leftSliderArray,sliderWrapperAsian)
    leftSliderArray.forEach((element,index)=>{
        element.addEventListener('click',()=>{
            console.log(index)
           
            if(index==0){
                // sliderWrapperAsian.style.scrollBehavior ='smooth'
                sliderWrapperAsian.scrollLeft-=400
               

            }else{
                // sliderWrapperFrench.style.scrollBehavior ='smooth'
                sliderWrapperFrench.scrollLeft-=400
               
            }
        })
    })
    rightSliderArray.forEach((element,index)=>{
        element.addEventListener("click",()=>{
            if(index==0){
                // sliderWrapperAsian.style.scrollBehavior ='smooth'
                sliderWrapperAsian.scrollLeft+=400
                
            }else{
                // sliderWrapperFrench.style.scrollBehavior ='smooth'
                sliderWrapperFrench.scrollLeft+=400
                
            }
        })
    })

}

