let palavras = ''

var palavra = false
var chance = 0
var tabuleiroletras = []
var tabuleiro = []

const letras = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ç"],
  ["z", "x", "c", "v", "b", "n", "m"]
]

let textoajuda =
  `<p>Você tem 6 chances para descobrir a palavra VRAU!</p>
<p>Após cada tentativa, a cor de cada letra vai mudar para mostrar o quão próximo você esttá da palavra certa</p>
<br><br>
<table id="exemplo1" class="table is-narrow is-family-monospace">
  <tr>
    <td class="td"> <div class="tag is-black   is-size-3"> T </div></td>
    <td class="td"> <div class="tag is-black   is-size-3"> E </div></td>
    <td class="td"> <div class="tag is-warning is-size-3"> S </div></td>
    <td class="td"> <div class="tag is-black   is-size-3"> T </div></td>
    <td class="td"> <div class="tag is-black   is-size-3"> E </div></td>
  </tr>
</table>
<p>A letra <strong>S</strong> está na palavra mas em outra posição</p>
<br><br>
  
<table id="exemplo1" class="table is-narrow is-family-monospace">
  <tr>
    <td class="td"> <div class="tag is-black   is-size-3"> J </div></td>
    <td class="td"> <div class="tag is-black   is-size-3"> E </div></td>
    <td class="td"> <div class="tag is-black   is-size-3"> S </div></td>
    <td class="td"> <div class="tag is-primary is-size-3"> U </div></td>
    <td class="td"> <div class="tag is-black   is-size-3"> S </div></td>
  </tr>
</table>
<p>A letra <strong>U</strong> está na palavra e na posição certa.</p>
<br><br>
   
<table id="exemplo1" class="table is-narrow is-family-monospace">
  <tr>
    <td class="td"> <div class="tag is-warning is-size-3"> R </div></td>
    <td class="td"> <div class="tag is-warning is-size-3"> E </div></td>
    <td class="td"> <div class="tag is-warning is-size-3"> S </div></td>
    <td class="td"> <div class="tag is-warning is-size-3"> T </div></td>
    <td class="td"> <div class="tag is-black   is-size-3"> O </div></td>
  </tr>
</table>
<p>A letra <strong>O</strong> não está na palavra em posição nenhuma.</p>`

document.addEventListener('keydown', (event) => {
  let tecla = event.key.toLowerCase()
  if (letras[0].includes(tecla) || letras[1].includes(tecla) || letras[2].includes(tecla)) {
    letra(tecla)
  } else {
    switch (tecla) {
      case 'backspace':
        limpar()
        break
      case 'enter':
        verificar()
        break
      case 'escape':
        closemodal()
        break
    }
  }
}, false);


main()
alerta(textoajuda)

async function main() {
  closemodal()
  chance = 0
  tabuleiroletras = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false]
  ]
  tabuleiro = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false]
  ]

  await fetch('https://raw.githubusercontent.com/xavitinho/palavrau/main/todas_as_palavras.json')
    .then(response => response.json())
    .then(jsonResponse => {
      palavras = jsonResponse
    })
  iniciatabuleiro()
  iniciateclado()
  sorteia()
}

function sorteia() {
  let sorteaveis = Object.keys(palavras.certas)
  n = Math.floor(Math.random() * sorteaveis.length)
  palavra = sorteaveis[n]
}

function iniciatabuleiro() {
  var tab = document.getElementById('tabuleiro')
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += `\n<tr id='p${i}'>`
    for (let j = 0; j < 5; j++) {
      code +=
        `\n
    <td class="td">
    <div id=p${i}l${j} class="tag is-dark is-size-3"><br></div>
    </td>`
    }
    code += '\n</tr>'
  }
  tab.innerHTML = code
}

function letra(l) {
  let j = 0
  while (tabuleiroletras[chance][j]) {
    j++;
  }
  if (j < 5) {
    tabuleiroletras[chance][j] = l
    let show = document.getElementById(`p${chance}l${j}`)
    show.innerText = l.toUpperCase()
  }
}

function verificar() {
  let skip = false;
  for (let l = 0; l < 5; l++) {
    if (!tabuleiroletras[chance][l]) {
      alerta('palavra incompleta!')
      skip = true;
    }
  }
  if (!skip) {
    let chute = ''
    for (let j = 0; j < 5; j++) {
      chute += tabuleiroletras[chance][j]
    }
    if (palavras.validas[chute] || palavras.certas[chute]) {
      let ls = palavra.split('')
      for (let j = 0; j < 5; j++) {
        ls[j] = ls[j].normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        let show = document.getElementById(`p${chance}l${j}`)
        let tecla = document.getElementById(tabuleiroletras[chance][j])
        if (ls[j] === tabuleiroletras[chance][j]) {
          show.className = show.className.replace('is-dark', 'is-primary')
          tecla.className = tecla.className.replace('is-light is-outlined', 'is-primary')
          tabuleiro[chance][j] = 2
        } else {
          if (ls.includes(tabuleiroletras[chance][j])) {
            show.className = show.className.replace('is-dark', 'is-warning')
            tecla.className = tecla.className.replace('is-light is-outlined', 'is-primary')
            tabuleiro[chance][j] = 1
          }
          else {
            show.className = show.className.replace('is-dark', 'is-black')
            tecla.className = tecla.className.replace('is-light is-outlined', 'is-black')
            tabuleiro[chance][j] = 0
          }
        }
      }
      if (chute === palavra.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) {
        chance++
        fim(true)
      } else {
        chance++
        if (chance > 5) {
          fim(false)
        }
      }
    } else {
      alerta('palavra não é valida')
    }
  }
}

function limpar() {
  for (let l = 0; l < 5; l++) {
    tabuleiroletras[chance][l] = false
    let show = document.getElementById(`p${chance}l${l}`)
    show.innerHTML = '<br>'
  }
}

function calcpt() {
  let sorte = 0
  let habilidade = 0

  letrasdesc = []
  let arrayp = palavra.split('')

  for (let p = 0; p < chance - 1; p++) {
    for (let l = 0; l < 5; l++) {
      if (tabuleiroletras[p].includes(arrayp[l]) && !letrasdesc.includes(arrayp[l])) {
        letrasdesc.push(arrayp[l])
      }
    }
  }

  let p = -1
  while (sorte === 0) {
    for (l of tabuleiro[p + 1]) {
      sorte += l * 10
    }
    p++
  }
  sorte -= p * 13
  if(chance>1) {
    habilidade += (6 - chance/2) * 10
  habilidade += (5 - letrasdesc.length/2) * 10
  }
  
  habilidade -= habilidade * sorte/150

  if (sorte < 0) { sorte = 0 }
  if (sorte > 100) { sorte = 100 }
  if (habilidade < 0) { habilidade = 0 }
  if (habilidade > 100) { habilidade = 100 }

  return ([sorte, habilidade])
}

function fazemoji() {
  let emojistt = ''
  let emojishtml = ''
  for (let p = 0; p < chance; p++) {
    for (let l = 0; l < 5; l++) {
      switch (tabuleiro[p][l]){
        case 0:
          emojistt += '⬛'
          emojishtml += '⬜ '
          break
        case 1:
          emojistt += '🟧'
          emojishtml += '🟧 '
          break
        case 2:
          emojistt += '🟩'
          emojishtml += '🟦 '
          break
      }
    }
    emojistt += '%0A'
    emojishtml += '<br>'
  }
  return([emojistt, emojishtml])
}

function fim(vitoria) {
  let pt = calcpt()
  let arrayp = palavra.split('')
  let emojis = fazemoji()
  let textovitoria = `
          <strong> PARABÉNS! Você venceu! </strong>
        
          <div class="palavrafinal">
            <br>
            <p> Palavra:</p>
            <table id="exemplo1" class="table is-narrow is-family-monospace">
              <tr>
                <td class="td"> <div class="tag is-primary is-size-3"> ${arrayp[0].toUpperCase()} </div></td>
                <td class="td"> <div class="tag is-primary is-size-3"> ${arrayp[1].toUpperCase()} </div></td>
                <td class="td"> <div class="tag is-primary is-size-3"> ${arrayp[2].toUpperCase()} </div></td>
                <td class="td"> <div class="tag is-primary is-size-3"> ${arrayp[3].toUpperCase()} </div></td>
                <td class="td"> <div class="tag is-primary is-size-3"> ${arrayp[4].toUpperCase()} </div></td>
              </tr>
            </table>
            <br>
          </div>
          <br><strong>compartilhe seu resultado:</strong><br>
          <div class="tabuleirofinal">
            <br> ${emojis[1]} <br>
          </div>

          <div class="barras">
            <strong style="font-size:0.8em"> sorte: </strong>
            <div class="barra">
              <div id="sorte" style="height: 100%; width:${pt[0]}%; background-color:#d22;">
                <strong>${pt[0]}%</strong>
              </div>
            </div>
            <br><strong style="font-size:0.8em"> habilidade: </strong>
            <div class="barra">
              <div id="habilidade" style="height: 100%; width:${pt[1]}%; background-color:#2b2;">
                <strong>${pt[1]}%</strong>
              </div>
            </div>
            <br>
            <br>
          </div>

          <div class="buttons">   
            <button class="button is-fullwidth is-light is-outlined" onclick="main()">jogar novamente</button>
            <a class="button is-fullwidth is-dark" href="https://twitter.com/compose/tweet?text=joguei+palaVRAU:%0A%0AA palavra era ${palavra.toUpperCase()}%0A${emojis[0]}%0Axavitinho.github.io/palavrau+de+@xavitinho+">compartilhar no twitter</a>
          </div>`

  if (vitoria) {
    alerta(textovitoria)
  } else {
    alerta(`<p>tente de novo :(</p>
    <div class="buttons"><button class="button is-fullwidth is-light is-outlined" onclick="main()">jogar novamente</button></div>`)
  }
}

function alerta(texto) {
  let a = document.getElementById('alerta')
  a.innerHTML = texto
  let b = document.getElementById('modal')
  b.className = 'modal is-active'
}

function closemodal() {
  let a = document.getElementById('modal')
  a.className = 'modal'
}

function iniciateclado() {
  for (let i = 1; i < 4; i++) {
    let linha = document.getElementById(`teclado-linha-${i}`)
    let code = ''
    if (i === 3) {
      code +=
        `<td>
        <button id="botão-enviar" onclick="verificar()" class="button is-light">
				<span>&nbsp;</span>
          <span>
						<ion-icon name="send"></ion-icon>
          </span>
        <span>&nbsp;</span>
        </button>
      </td>`
    }
    for (l of letras[i - 1]) {
      code +=
        `<td> <button id="${l}" onclick="letra('${l}')" class="button is-light is-outlined">${l.toUpperCase()}</button> </td>`
    }
    if (i === 3) {
      code +=
        `<td>
        <button id="botão-limpar" onclick="limpar()" class="button is-light is-outlined">
        <span>
          <ion-icon name="close-circle"></ion-icon>
        </span>
        </button>
      </td>`
    }
    linha.innerHTML = code
  }
}

