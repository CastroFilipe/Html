const cores = { //atribuindo uma cor a cada tag. Serão utilizadas mais adiante no código
    p: '#388e3c',
    div: '#1565c0',
    span: '#e53935',
    section: '#f67809',
    ul: '#5e35b1',
    ol: '#fbc02d',
    header: '#d81b60',
    nav: '#64dd17',
    main: '#00acc1',
    footer: '#304ffe',
    form: '#9f6581',
    body: '#25b6da',
    padrao: '#616161',

    //função get que recebe o nome da tag e retorna a cor associada a tag. 
    //Se não existir retornará a cor padrão.
    get(tag){
        return this[tag] ? this[tag] : this[padrao]
    }
}


document.querySelectorAll('.tag').forEach((elemento)=>{
    //salva o nome da tagAtual em tagName
    const tagName = elemento.tagName.toLowerCase();
    
    //elemento.style.borderColor = '#616161' //as bordas ficarão cinzas
    elemento.style.borderColor = cores.get(tagName)

    if(!elemento.classList.contains('nolabel')){//
        const label = document.createElement('label')
        label.style.backgroundColor = cores.get(tagName) //atribuindo uma cor de acordo com a tag
        label.innerHTML = tagName
        elemento.insertBefore(label, elemento.childNodes[0])

    }
    
})