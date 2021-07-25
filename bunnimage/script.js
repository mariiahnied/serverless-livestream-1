function getImage(event){
    event.preventDefault()
    var myform = document.getElementById("myform");
    let nameInput = document.getElementById("username");
    let fileInput = document.getElementById("image");
    let file = fileInput.files[0]

    var payload = new FormData(myform);
    console.log(payload);
    payload.append("file", file);
    $('#output').text("Thanks!")
    


    if(document.getElementById("username").value != ''){

        try{
            let url = "https://bunni1.azurewebsites.net/api/bunnimage-upload"
            console.log("Image was uploaded, making POST request to Azure function")
            //create request to Azure function
            const resp = await fetch(url,{
                method:'POST',
                headers:{
                    'codename': nameInput.value
                },
                body: payload
            })
            console.log("POST request was made successfully")
            $('#output').text("Your image has been stored successfully!")
        } catch(err){
            $('#output').text(err)
        }
    }
    else{
        alert("No name error.")
    }
}
       