async function getImage(event){
    event.preventDefault()
    var myform = document.getElementById("myform");
    /*
    console.log("myform is")
    console.log(myform)
    console.log("value")
    console.log(myform.value)
    */
    let nameInput = document.getElementById("username"); //name of the file
    /*
    console.log("nameInput is")
    console.log(nameInput)
    console.log("value")
    console.log(nameInput.value)
    */
    let fileInput = document.getElementById("image");//C:\fakepath\beyonce.jpg
    /*
    console.log("fileInput is")
    console.log(fileInput)
    console.log("value")
    console.log(fileInput.value)
    */
    let file = fileInput.files[0]
    /*
    console.log("file is ")
    console.log(file)
    console.log("value")
    console.log(file.value)
    */

    var payload = new FormData(myform);
    /*
    console.log("payload is ")
    console.log(payload)
    console.log("value")
    console.log(payload.value)
    */
    payload.append("file", file);
    /*
    console.log("now payload is ")
    console.log(payload)
    console.log("value")
    console.log(payload.value)
    */
    $('#output').text("Thanks!")
    

    if(document.getElementById("username").value != ''){

        try{
            let url = "https://bunni1.azurewebsites.net/api/bunnimage-upload"
            console.log("Image was uploaded, making POST request to Azure function")
            //create request to Azure function
            const resp = await fetch (url,{
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

    
async function downloadImage(){
    let username = document.getElementById("downloadusername").value;
    console.log(username)
    
    if(username != ''){

        try{
            let url = "https://bunni1.azurewebsites.net/api/bunnimage-download"
            console.log("Making GET request to Azure bunniimage-download function")
            //create request to Azure function
            const resp = await fetch(url, {
                method:'GET',
                headers: {
                    'username': username
                }
            })
            console.log("GET request was made successfully")
            
            let data = await resp.json() //in order to use infromation in resp, we need to make a JS object from a JSON by calling this
            let imageUrl = data.downloadUri
            //console.log("data")
            //console.log(data)
            //console.log("imageUrl")
            //console.log(imageUrl)
            window.open(imageUrl, "_self")
            $('#output').text("Your image has been downloaded successfully!")

        } catch(err){
            $('#output').text(err)
        }
    }
    else{
        alert("No name error.")
    }
}
       