let dateFormat = "mm/dd/yy",
    flag = 0,
    from = $( "#datepicker1" )
    .datepicker({
        minDate:'0d'
    })
    .on( "change", function() {
        //to.datepicker( "option", "minDate", getDate( this ) );
        console.log(this.value);
        //to.datepicker( "option", "minDate", getDate(this) );
        let d = new Date(this.value);
        d.setDate(d.getDate()+1);
        to.datepicker( "option", "minDate", d);
    }),
    to = $( "#datepicker2" ).datepicker({
        minDate:'+1d'
    })
    .on( "change", function() {
        //from.datepicker( "option", "maxDate", getDate( this ) );
        console.log(this.value);
        let startDate = new Date($('#datepicker1').val());
        let endDate = new Date(this.value)
        let noOfDays = (Math.round(Math.abs(endDate.getTime() - startDate.getTime()) / (24 * 60 * 60 * 1000)));
        let price = Number(document.getElementById("price").getAttribute('data-price'));
        document.getElementById("price").innerHTML = `<p>Total for ${noOfDays} nights $${price*noOfDays}</p>`;
    });

function booking(){
    let query = `/confirmbooking?property_id=${document.getElementById('propertyid').textContent}&from_date=${document.getElementById('datepicker1').value}&to_date=${document.getElementById('datepicker2').value}`
    console.log(query);
    fetch(query)
    .then((response)=>response.json())
    .then((data) => {
        console.log(data);
        if(data.error === 0){
            alert('Booking Confirmed');
        }else{
            alert('Login to book');
        }
    });
}