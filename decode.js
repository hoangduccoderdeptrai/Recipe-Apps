var simplifyPath = function(path) {
    let t ='/'
    let string =''
    let pre =''
    for(let i=0;i<path.length;i++){
        let t =path[i]
        if(t=='/'&&pre==t){
            pre =t
        }else {
            string+=t
            pre=t
        }
    }
    
    
    let array =[]
    let ans=[]
    ans.push('/')
    array = string.split('/')
    if(array[0]=='')array =array.slice(1)
    if(array[array.length-1]=='')array =array.slice(0,array.length-1)
    
    for(let i=0;i<array.length;i++){
       if(array[i]==".."&& ans.length>1){
           
            ans.pop()
       }else if(array[i]!='.'&&array[i]!=".."){
           
            ans.push(array[i])
       }
    }
    ans = ans.join('/')
    if(ans[0]=='/' && ans.length>1)ans =ans.slice(1)
    if(ans[ans.length-1]=='/' && ans.length>1) ans=ans.slice(0,ans.length-1)
    return ans
};
let path ="/../"
console.log(simplifyPath(path))