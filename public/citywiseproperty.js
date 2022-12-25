function goto(url){
    window.location.href=`/listing/${url}`;
}

function decrement(id){
    let value = document.getElementById(id).textContent.replace('+', '');
    if(value>1){
        document.getElementById(id).textContent = --value+"+";
    }
    fetchResult();
}
function increment(id){
    let value = document.getElementById(id).textContent.replace('+', '');
    document.getElementById(id).textContent = ++value+"+";
    fetchResult();
}

function fetchResult(){
    let query = window.location.href,
        flag = 0;
    if(document.getElementById('apartments').checked){
        query+='?propertytype='+document.getElementById('apartments').value;
        flag=1;
    }
    if(document.getElementById('villa').checked){
        if(flag===1){
            query+='&propertytype='+document.getElementById('villa').value;
            flag=2;
        }else{
            query+='?propertytype='+document.getElementById('villa').value;
            flag=2;
        }
        
    }
    if(document.getElementById('house').checked){
        if(flag===2 || flag===1){
            query+='&propertytype='+document.getElementById('house').value;
        }else{
            query+='?propertytype='+document.getElementById('house').value;
        }
        
    }
    const bedrooms = document.getElementById('bedrooms').textContent.replace('+', '')
    const bathrooms = document.getElementById('bathrooms').textContent.replace('+', '')
    query = `${query}&bedrooms=${bedrooms}&bathrooms=${bathrooms}&ajax=1`;

    console.log(query);
    fetch(query)
    .then((response)=>response.json())
    .then((data) => {
        console.log(data);
        let dataHtml = "";
        for(let i=0; i<data.length; i++){
            dataHtml += `
            <div class="col-6 mb-4 listing-property" onclick="goto('${data[i]._id}')">
                <div class="row position-relative listing-container">
                    <div class="col-6 p-0">
                    <img src="${data[i].picture_url}" class="img-fluid listing-image" />
                    </div>
                    <div class="col-6 pt-3 ps-3">
                        <p>${data[i].name}</p>
                        <p></p>
                        <p><span class="material-symbols-outlined position-relative" style="top:5px">bed</span><span>${data[i].bedrooms} bedrooms</span> <span class="material-symbols-outlined position-relative" style="top:3px">bathtub</span>${data[i].bathrooms} bathrooms</p>
                        <p class="rental-price">from &dollar;${data[i].price} / night</p>
                    </div>
                </div>
            </div>`
        }
        document.getElementById("result").innerHTML = dataHtml;
    });
}
