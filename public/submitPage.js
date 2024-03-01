const btnIngr =document.querySelector('.btn-ingr')
const addinput =document.querySelector('.input-ingr')

btnIngr.addEventListener('click',()=>{
    const input =document.createElement('input')
    addinput.appendChild(input)
})