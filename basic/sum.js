function sum1(n){
    return ((n+1)*n)/2;
}



function sum(n){
    let result2 = 0;
    for(var i=1;i<=n;i++){
            result2+=i;
    }
    return result2;
}


console.log(sum1(10),sum(10));
console.log(sum1(3),sum(3));
console