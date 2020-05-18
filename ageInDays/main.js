function calcAge(){
    let currentYear = prompt("Enter the Current year: ");
    let birthYear = prompt("Enter Your Birth Year: ");
    ageInDays = (currentYear - birthYear) * 365;
    let h2 = document.createElement('h2');
    let result = document.createTextNode('You are ' + ageInDays + ' days old.');
    h2.setAttribute('id', 'ageInDays');
    h2.appendChild(result);
    document.getElementById('flex-box-result').appendChild(h2);
}
function reset(){
    document.getElementById('ageInDays').remove();
}
