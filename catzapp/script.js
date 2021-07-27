async function y1k3s(){
    let name = document.getElementById("name").value
    let endpoint = "https://cataas.com/cat/says/" + name

    if (name != ''){
      try{
        document.getElementById("image").src = endpoint
        document.getElementById("image").alt= "Cat with written name"
      }
      catch(err){
            $('#output').text(err)
        }
    }
    else{
      alert("No name error.")
    }
}