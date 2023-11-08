// MDN WebSocket documentation
// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

let socket, endpoint

function createConnection(){
  document.getElementById('connectedBool').innerHTML = "connecting!"
  endpoint = document.getElementById('websocketEndpoint').value
  console.log(endpoint)
  try{
    socket = new WebSocket(endpoint)
  }catch(error){
    console.log(error)
    document.getElementById('connectedBool').innerHTML = "MAKE SURE YOU REPLACE HTTPS WITH WSS"
    document.getElementById('askButton').disabled = true
  
  }

  socket.addEventListener('open', e => {
    console.log('WebSocket is connected', e)
    document.getElementById('askButton').disabled = false
    document.getElementById('connectedBool').innerHTML = "yup!"
  })
  
  socket.addEventListener('close', e => {
    console.log('WebSocket is closed')
    document.getElementById('askButton').disabled = true
  })
  
  socket.addEventListener('error', e => {
    console.error('WebSocket is in error', e)
    document.getElementById('connectedBool').innerHTML = "Error! Check the console"
    document.getElementById('askButton').disabled = true
  })
  
  socket.addEventListener('message', e => {
    console.log('WebSocket received a message:', e)
    console.log('Your answer is:', JSON.parse(e.data).message)
    document.getElementById('connectionId').innerHTML=JSON.parse(e.data).connectionId
    document.getElementById('message').innerHTML = JSON.parse(e.data).message
    getPokemonById(JSON.parse(e.data).message)
  })
}

const socketEndpointInput = document.getElementById("websocketEndpoint")


window.ask = function (msg) {
  const payload = {
    action: 'message',
    msg
  }
  socket.send(JSON.stringify(payload))
}

function getPokemonById(id){
  const uri = `https://pokeapi.co/api/v2/pokemon/${id}`

  const pokemonName = document.getElementById('pokemonName')
  const pokemonImage = document.getElementById('pokemonImage')
  fetch(uri)
    .then(response => response.json())
    .then(pokemon => { 
      pokemonName.innerHTML = pokemon.name
      pokemonName.style.color = 'black'
      
      const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
      pokemonImage.src = image
    })
}