let BASE_URL = "https://join-19628-default-rtdb.firebaseio.com";


async function init(){
    try {
        await onloadData("/"); 
    } catch (error) {
        console.log("error")
    }
    
}
async function onloadData(path=""){
    let response = await fetch(BASE_URL + path + '.json');
    let responseToJson = await response.json();
    console.log(responseToJson);
}
