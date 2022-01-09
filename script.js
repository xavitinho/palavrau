let palavras = ''

var palavra = false
var chance = 0
var tabuleiro = []

const letras = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ç"],
  ["z", "x", "c", "v", "b", "n", "m"]
]

let iniciotxt = `
<section>
  <div class="instructions">
    <p>Você tem 6 chances para descobrir a palavra VRAU!</p>
    <p>Após cada tentativa, a cor de cada letra vai mudar para mostrar o quão próximo você está da palavra certa</p>
    <br><br>
    <div class="examples">
      <div class="example">
        <table id="exemplo1" class="table is-narrow is-family-monospace">
          <tr>
            <td class="td"> <div class="tag is-black   is-size-3"> t </div></td>
            <td class="td"> <div class="tag is-black   is-size-3"> e </div></td>
            <td class="td"> <div class="tag is-warning is-size-3"> s </div></td>
            <td class="td"> <div class="tag is-black   is-size-3"> t </div></td>
            <td class="td"> <div class="tag is-black   is-size-3"> e </div></td>
          </tr>
        </table>
        <p>A letra <strong>S</strong> está na palavra mas em outra posição</p>
        <br><br>
      </div>
      <div class="example">
        <table id="exemplo1" class="table is-narrow is-family-monospace">
          <tr>
            <td class="td"> <div class="tag is-black   is-size-3"> J </div></td>
            <td class="td"> <div class="tag is-black   is-size-3"> e </div></td>
            <td class="td"> <div class="tag is-black   is-size-3"> s </div></td>
            <td class="td"> <div class="tag is-primary is-size-3"> u </div></td>
            <td class="td"> <div class="tag is-black   is-size-3"> s </div></td>
          </tr>
        </table>
        <p>A letra <strong>U</strong> está na palavra e na posição certa.</p>
        <br><br>
      </div>
      <div class="example">
        <table id="exemplo1" class="table is-narrow is-family-monospace">
          <tr>
            <td class="td"> <div class="tag is-warning is-size-3"> r </div></td>
            <td class="td"> <div class="tag is-warning is-size-3"> e </div></td>
            <td class="td"> <div class="tag is-warning is-size-3"> s </div></td>
            <td class="td"> <div class="tag is-warning is-size-3"> t </div></td>
            <td class="td"> <div class="tag is-black   is-size-3"> o </div></td>
          </tr>
        </table>
        <p>A letra <strong>O</strong> não está na palavra em posição nenhuma.</p>
      </div>
    </div>
  </div>
</section>`

main()
alerta(iniciotxt)

async function main() {
  closemodal()
  chance = 0
  tabuleiro = [
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false],
    [false, false, false, false, false, false]
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
    for (let j = 1; j < 6; j++) {
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
  let j = 1
  while (tabuleiro[chance][j]) {
    j++;
  }
  if (j < 6) {
    tabuleiro[chance][j] = l
    let show = document.getElementById(`p${chance}l${j}`)
    show.innerText = l.toUpperCase()
  }
}

function verificar() {
  let skip = false;
  for (let l = 1; l < 6; l++) {
    if (!tabuleiro[chance][l]) {
      alerta('palavra incompleta!')
      skip = true;
    }
  }
  if (!skip) {
    let chute = ''
    for (let j = 1; j < 6; j++) {
      chute += tabuleiro[chance][j]
    }
    console.log(chute)
    if (palavras.validas[chute] || palavras.certas[chute]) {
      let ls = palavra.split('')
      for (let j = 0; j < 5; j++) {
        console.log(ls[j])
        if (ls[j] !== 'ç') {
          ls[j] = ls[j].normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        }
        console.log(ls[j])
        let show = document.getElementById(`p${chance}l${j + 1}`)
        let tecla = document.getElementById(tabuleiro[chance][j + 1])
        if (ls[j] === tabuleiro[chance][j + 1]) {
          show.className = show.className.replace('is-dark', 'is-primary')
          tecla.className = tecla.className.replace('is-light is-outlined', 'is-primary')
        } else {
          if (ls.includes(tabuleiro[chance][j + 1])) {
            show.className = show.className.replace('is-dark', 'is-warning')
            tecla.className = tecla.className.replace('is-light is-outlined', 'is-primary')
          }
          else {
            show.className = show.className.replace('is-dark', 'is-black')
            tecla.className = tecla.className.replace('is-light is-outlined', 'is-black')
          }
        }
      }
      if (palavra === chute) {
        fim(true)
      }
      chance++
      console.log(chance)
      if (chance > 5) {
        fim(false)
      }
    } else {
      alerta('palavra não é valida')
    }
  }
}

function limpar() {
  for (let l = 1; l < 6; l++) {
    tabuleiro[chance][l] = false
    let show = document.getElementById(`p${chance}l${l}`)
    show.innerHTML = '<br>'
  }
}

function fim(vitoria) {
  if (vitoria) {
    alerta('VITORIA!!!!!!')
  } else {
    alerta('tente de novo :(')
  }
  let a = document.getElementById('alerta')
  a.innerHTML += `<button class="button is-fullwidth is-dark is-outlined" onclick="main()">jogar novamente</button>
  `
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
          <span class="icon is-small">
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
        <span class="icon is-small">
          <ion-icon name="close-circle"></ion-icon>
        </span>
        </button>
      </td>`
    }
    linha.innerHTML = code
  }
}

