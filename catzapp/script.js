async function y1k3s(){
    let name1 = document.getElementById("name1").value
    let name2 = document.getElementById("name2").value
    let name3 = document.getElementById("name3").value
    let name4 = document.getElementById("name4").value
    
    


    let endpoint1 = "https://cataas.com/cat/says/" + name1
    if (name1 != ''){
      try{
        document.getElementById("image1").src = "data:image/png;base64 ," + endpoint1
        //document.getElementById("image1").src = endpoint1
        document.getElementById("image1").alt= "Cat1 with written name"
      }
      catch(err){
            $('#output').text(err)
        }
    }
    else{
      alert("No name error.")
    }

    let endpoint2 = "https://cataas.com/cat/says/" + name2
    if (name2 != ''){
      try{
        document.getElementById("image2").src = "data:image/png;base64 ," + endpoint2
        //document.getElementById("image2").src = endpoint2
        document.getElementById("image2").alt= "Cat2 with written name"
      }
      catch(err){
            $('#output').text(err)
        }
    }
    else{
      alert("No name error.")
    }

    let endpoint3 = "https://cataas.com/cat/says/" + name3
    if (name3 != ''){
      try{
        document.getElementById("image3").src = "data:image/png;base64 ," + endpoint3
        //document.getElementById("image3").src = endpoint3
        document.getElementById("image3").alt= "Cat3 with written name"
      }
      catch(err){
            $('#output').text(err)
        }
    }
    else{
      alert("No name error.")
    }

    let endpoint4 = "https://cataas.com/cat/says/" + name4
    if (name4 != ''){
      try{
        document.getElementById("image4").src = "data:image/png;base64 ," + endpoint4
        //document.getElementById("image4").src = endpoint4
        document.getElementById("image4").alt= "Cat4 with written name"
      }
      catch(err){
            $('#output').text(err)
        }
    }
    else{
      alert("No name error.")
    }
}