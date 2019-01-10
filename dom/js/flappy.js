//função para criar um novo elemento e adicionar uma classe a esse elemento
function novoElemento(tagName, className){
    const elem = document.createElement(tagName)//cria um elemento, ex: div
    elem.className = className //Adiciona uma classe para aplicar estilos ao elemento criado. É equivalente a classList.add()
    return elem    
}

//função para criar uma barreira. As barreiras podem ser de dois tipos: de cima para baixo(reversa) e de baixo para cima
//o parametro 'reversa' indica se ela é uma barreira normal ou reversa
function barreira(reversa = false){
    //criará um atributo 'elemento' que recebe um elem vindo da função. Nesse caso criamos uma div e aplicamos a classe .barreira
    this.elemento = novoElemento('div', 'barreira')//o this indica que o atributo estará visível globalmente.
    
    //criando a borda e o corpo da barreira
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')

    //teste para saber se a barreira criada será normal ou reversa
    this.elemento.appendChild(reversa ? corpo : borda)//se reversa adiciona primeiro o corpo, se não adiciona a borda
    this.elemento.appendChild(reversa ? borda : corpo)//completa adicionando o corpo ou a borda(caso reversa = true)

    //definirá a altura do corpo. A altura deve ser aleatória para cada corpo do obstaculo
    //uma função para uso posterior. recebe uma altura como parametro e modifica a altura do corpo
    this.setAltura = altura => corpo.style.height = `${altura}px`
}

//função para criar o par de barreiras e definir a abertura entre eles.
function parDeBarreiras(alturaDoJogo, aberturaEntre, x){
    //criará um div
    this.elemento = novoElemento('div', 'par-de-barreiras')

    //criará a barreira superior(reversa) e inferior
    this.superior = new barreira(true)
    this.inferior = new barreira(false)

    //adiciona a barreira superior e inferior a div par-de-barreiras
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    //função que irá sortear o local da abertura entre as duas barreiras. O this torna a função visível fora do escopo
    this.sortearAbertura = () => {

        const altBarreiraSuperior = Math.random() * (alturaDoJogo - aberturaEntre)
        const altBarreiraInferior = alturaDoJogo - aberturaEntre - altBarreiraSuperior

        this.superior.setAltura(altBarreiraSuperior)
        this.inferior.setAltura(altBarreiraInferior)

    }

    //função que retornará o valor x para saber onde a barreira está localizada na tela
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])

    //função para modificar a posição x do par de barreiras.. Recebe a nova posição X como parametro
    this.setX = x => this.elemento.style.left = `${x}px`

    //função para saber a largura do elemento par-de-barreiras
    this.getLargura = () => this.elemento.clientWidth

    this.sortearAbertura()
    this.setX(x)//o x recebido com parametro na função parDeBarreiras será usado para setar a nova posição das barreiras

}

function Barreiras(alturaJogo, larguraJogo, aberturaEntre, distanciaEntreBarreiras, atualizarPontuacao){
    this.pares = [//um array contendo pares de barreiras,seguidas umas das outras, para a animação
        new parDeBarreiras(alturaJogo, aberturaEntre, larguraJogo),//larguraJogo é a posição x do par-de-barreiras. Assim cada par começara fora da tela(1200px).
        new parDeBarreiras(alturaJogo, aberturaEntre, larguraJogo + distanciaEntreBarreiras),//a posição será o tamanho da tela + um espaço de distância para a barreira anterior
        new parDeBarreiras(alturaJogo, aberturaEntre, larguraJogo +distanciaEntreBarreiras *2),
        new parDeBarreiras(alturaJogo, aberturaEntre, larguraJogo +distanciaEntreBarreiras *3)
    ]

    const deslocamento = 3//de quanto em quantos pixels as barreiras serão deslocadas para gerar a animação
    
    this.animar = () => { //funcao animar, para simular o movimento das barreiras

        //laço for em cada elemento do array pares
        this.pares.forEach(par => {
            //em cada para irá setar a nova posição do par de barreiras. posicaoAtual - 3px 
            par.setX(par.getX() - deslocamento)

            //condicional para verificar se o par de barreira já chegou ao fim da tela e se ele já saiu totalmente
            //pega a posição atual getX. Quando as barreiras começarem a sair da area do jogo, a posição left x dessas barreiras se torna negativa.
            if(par.getX() < -par.getLargura()){
                //retorna o par de barreira para o inicio, reaproveitando a mesma barreira novamente
                par.setX(par.getX() + distanciaEntreBarreiras * this.pares.length)
                par.sortearAbertura()//sortear a abertura para não ficar repetitivo
            }

            //trecho de código para checar se o par de barreiras cruzou o meio do jogo e atualizar a pontuação
            const meioDoJogo = larguraJogo /2
            const cruzouOMeio = par.getX() + deslocamento >= meioDoJogo && par.getX() < meioDoJogo
            
            if(cruzouOMeio) atualizarPontuacao()//se a barreira passou do meio então fez um ponto
        
        })
    }
}


function passaro (alturaDoJogo){
    let voando = false;//definirá se o passaro está voando ou não
    
    this.elemento = novoElemento('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    //pegar a distância do passaro até o chão
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])

    this.setY = y => this.elemento.style.bottom = `${y}px`

    //ao prescionar uma tecla, mudar a variavel voando para true, ao soltar a tecla, mudar para falso
    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false

    //para manipular a altura do passaro e dar a impressão de que ele está voando
    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaDoJogo - this.elemento.clientHeight

        if(novoY <= 0){
            this.setY(0) //impede que o passaro desça e saia da tela.
        } else if(novoY >= alturaMaxima) {
            this.setY(alturaMaxima)//impede que o passaro saia da tela ao atingir o topo
        } else {
            this.setY(novoY)
        }

    }

    this.setY(alturaDoJogo / 2)//posição inicial do passaro. Inicial no meio
}

//função que trata da pontuação
function progresso(){
    this.elemento = novoElemento('span','progresso')
    this.atualizarPontos = pontos => {
        this.elemento.innerHTML = pontos
    }

    this.atualizarPontos(0) //pontuação inicia em zero
}

//função para detectar a sobreposição de dois elementos e posteriormente detectar a colisão
function estaoSobrepostos(elementoA, elementoB){
    const a = elementoA.getBoundingClientRect()//função que pega o retangulo onde está contido o elemento
    const b = elementoB.getBoundingClientRect()

    //teste de sobreposição horizontal
    const horizontal = a.left + a.width >= b.left && b.left + b.width >= a.left

    //teste de sobreposição vertical
    const vertical = a.top + a.height >= b.top && b.top + b.height >= a.top

    //retorna true se os elementos estão sobrepostos
    return horizontal && vertical
}

function colidiu(passaro, barreiras){
    let colidiu = false

    barreiras.pares.forEach(par => {
        if(!colidiu){//entra no if se ainda não aconteceu a colisão
            const superior = par.superior.elemento
            const inferior = par.inferior.elemento

            colidiu = estaoSobrepostos(passaro.elemento, superior) || 
            estaoSobrepostos(passaro.elemento, inferior)

        }
    })

    return colidiu
}

//função principal do jogo
function flappyBird(){
    let pontos = 0

    //pegando a area do jogo
    const areaDoJogo = document.querySelector('[wm-flappy]')

    //pegando a altura e largura da div wm-flappy
    const altura = areaDoJogo.clientHeight
    const largura = areaDoJogo.clientWidth

    const progresso1 = new progresso()
    const barreiras1 = new Barreiras(altura, largura, 200, 400, ()=>{
        progresso1.atualizarPontos(++pontos)        
    })

    const passarinho = new passaro(altura)

    //adicionando a area do jogo
    areaDoJogo.appendChild(progresso1.elemento)
    areaDoJogo.appendChild(passarinho.elemento)
    barreiras1.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        //loop do jogo
        const temporizador = setInterval(() => {
            barreiras1.animar()
            passarinho.animar()

            if(colidiu(passarinho, barreiras1)){
                clearInterval(temporizador)
            }
        }, 20)
    }

}

new flappyBird().start()



