function generateCat(){
    let image = document.createElement('img');
    let div = document.getElementById('flex-box');
    image.src = "./cat.gif";
    div.appendChild(image);
}