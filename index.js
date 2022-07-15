const scoreEl = document.querySelector('#scoreEl')
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width=innerWidth /*faz com que apareca 
no ecra inteiro*/
canvas.height=innerHeight//vem de window.blabla

//*** criar a nave ***

class Player{
    constructor() { //age qnd criarmos um plyr
        /*o que caractriza um plyr? */ 
        //posicao
        //this.position={x: canvas.width/2-this.width/2,
          //  y : 200}  da erro pq ele n conhece a width e etc



        //velocidade
        this.velocity={x: 0, y:0}

        this.rotation =0
        this.opacity=1
        //uma imagem q o represente
        const image = new Image()
        image.src='./spaceship.png' //vamos buscar a imagem ao ficheiro
        image.onload =() =>{ //fzr isto qnd imagem estiver carregada
            const scale =0.35
            this.image= image
            this.width=image.width*scale
            this.height=image.height*scale
            //mete a imagem com o tamanho correto para n perder qualidade e faz a escala para diminuir
        
            //pos
            this.position={x: canvas.width/2-this.width/2,
            y : canvas.height-this.height-20} 
            //mete no fim, e mete para cima 20 px mais o tamanho da imagem

        }
    }

    //desenha o player
    draw(){

        /* *** improvisado *** 
       // c.fillStyle = 'red'//o player passa a ser um obj red
        //c.fillRect(this.position.x, this.position.y, this.width, this.height)
        //dizemos qual é a pos do plyr e a sua altura e largura
        
        //if(this.image)
       //apenas fazer isto se a imagem existir senao da erro
         */
        c.save()
        c.globalAlpha=this.opacity
        c.translate(//move o canvas
            player.position.x+player.width/2, //para a canvas ficar no meio do plyr
            player.position.y+player.height/2
        )
        
        c.rotate(this.rotation)

        c.translate(//move o canvas
            -player.position.x-player.width/2, //para a canvas ficar no meio do plyr
            -player.position.y-player.height/2
        )

        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width, 
            this.height
        )
        c.restore()
        
    }

    update(){
        if(this.image){//so faz isto quando a imagem estiver pronta
            this.draw()
            this.position.x += this.velocity.x //adicionamos a velocidada á posicao
            this.position.y += this.velocity.y
        }
    }
}

class Projectile{
    constructor({position, velocity}){
        this.position=position
        this.velocity=velocity
        this.radius = 4
    }

    draw(){
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2) //cria um circulo 
        c.fillStyle= '#00ccff'
        c.fill()
        c.closePath()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y +=this.velocity.y
    }
}

class Particle{
    constructor({position, velocity, radius, color, fades}){
        this.position=position
        this.velocity=velocity
        this.radius = radius
        this.color=color
        this.opacity =1
        this.fades=fades
    }

    draw(){
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2) //cria um circulo 
        c.fillStyle=this.color
        c.fill()
        c.closePath()
        c.restore()
    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y +=this.velocity.y
        if(this.fades){
            this.opacity-=0.01
        }
    }
}

class Invader{
    constructor({position}) { 
        //velocidade
        this.velocity={x: 0, y:0}

        //uma imagem q o represente
        const image = new Image()
        image.src='./invader.png' //vamos buscar a imagem ao ficheiro
        image.onload =() =>{ //fzr isto qnd imagem estiver carregada
            const scale =1
            this.image= image
            this.width=image.width*scale
            this.height=image.height*scale
          
            //pos
            this.position={
                x: position.x,
                y : position.y
            } 
           

        }
    }

    draw(){
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.width, 
            this.height
        )      
    }

    update({velocity}){
        if(this.image){//so faz isto quando a imagem estiver pronta
            this.draw()
            this.position.x += velocity.x //adicionamos a velocidada á posicao
            this.position.y += velocity.y
        }
    }

    shoot(invadeProjectiles){
        invaderProjectiles.push(
            new InvaderProjectile({
                position:{
                    x: this.position.x+this.width/2,
                    y: this.position.y + this.height
                },
                velocity:{
                    x:0,
                    y:5
                }
            })
        )
    }
}
class InvaderProjectile{
    constructor({position, velocity}){
        this.position=position
        this.velocity=velocity
        this.width=3
        this.height = 10
    }

    draw(){
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

    }

    update(){
        this.draw()
        this.position.x += this.velocity.x
        this.position.y +=this.velocity.y
    }
}

class Grid{
    constructor(){
        this.position={
            x:0,
            y:0
        }

        this.velocity= {
            x:3,
            y:0
        }

        this.invaders= []
                        //floor arredonda
        const rows = Math.floor(Math.random()*5+2)//dá-nos um valor entre 0 e 5 
        const coluns = Math.floor(Math.random()*10+5)
        this.width=coluns*30
        for(let x = 0; x<coluns;x++){//para criar filas de 10 
            for(let y =0; y<rows; y++){//haver um numero de filas aleatorio
                this.invaders.push(
                    new Invader({
                        position:{
                            x:x*30,
                            y:y*30
                        }
                    })
                )
            }
        }
    }

    update(){
        this.position.x+=this.velocity.x
        this.position.y+=this.velocity.y

        this.velocity.y=0
        if(this.position.x + this.width >= canvas.width || this.position.x <=0){
            this.velocity.x=-this.velocity.x
            this.velocity.y=30 //desce com uma velocidade de 30 NUM FRAME APENAS
        }
    }
}

const player = new Player()
const projectiles =[]
const invaderProjectiles=[]
const grids = []
const particles=[]
const keys ={ //monitoriza o estado das keys
    a: {
        pressed: false
    },
    d: {
        pressed: false 
    },
    w: {
        pressed: false 
    },
    s: {
        pressed: false 
    },
    space: {
        pressed: false 
    },
}

let frames =0 
let random_interval = Math.floor((Math.random()*500)+500)
let game={
    over: false,
    active: true
}
let score=0

for(let i = 0; i< 100; i++){
    particles.push(new Particle({
        position:{
            x:Math.random()*canvas.width,
            y:Math.random()*canvas.height
        },
        velocity:{
            x:0,
            y:(Math.random())*2
        },
        radius: Math.random()*2,
        color: 'white'
    }))
}



function createParticles({object, color, fades}){
    for(let i = 0; i< 15; i++){
        particles.push(new Particle({
            position:{
                x:object.position.x + object.width/2,
                y:object.position.y+ object.height/2
            },
            velocity:{
                x:(Math.random()-0.5)*2,
                y:(Math.random()-0.5)*2
            },
            radius: Math.random()*3,
            color: color || '#BAA0DE',
            fades
        }))
    }
}

function animate() {

    if(!game.active) return

    requestAnimationFrame(animate)//pede para o browser fazer uma animacao e chamamos a funcao que vai animar
    //ao chamar mos a mm funcao vamos criar um loop
    
    c.fillStyle ='black'
    c.fillRect(0, 0, canvas.width, canvas.height) //para meter sempre o background a preto depois de um move
    
    player.update()
    particles.forEach((particle, i) => {

        if(particle.position.y - particle.radius >=canvas.height){
            particle.position.x=Math.random() *canvas.width
            particle.position.y=-particle.radius

        }
        if(particle.opacity<=0){
            setTimeout(()=>{
                particles.splice(i,1)
            },0)
        } else{
            particle.update()
        }
    })
    invaderProjectiles.forEach((invaderProjectile, index) =>{
        if(invaderProjectile.position.y+invaderProjectile.height 
            >= canvas.height){
            setTimeout(()=>{
                invaderProjectiles.splice(index,1)
            },0)
        }else{
            invaderProjectile.update()
        }
        //project hit plyr
        if(invaderProjectile.position.y + invaderProjectile.height>= player.position.y
            && invaderProjectile.position.y <= player.position.y+player.height
            && invaderProjectile.position.x+invaderProjectile.width>=player.position.x 
            && invaderProjectile.position.x <= player.position.x+player.width)
        {
            
            setTimeout(()=>{
                invaderProjectiles.splice(index,1)
                player.opacity=0
                game.over=true
            },0)

            setTimeout(() =>{
                game.active=false
            }, 2000)

            createParticles({
                object: player,
                color: 'white',
                fades:true
            })


        }
    })
    projectiles.forEach((projectile, index)=> {//for each da o index q e o numero do projectil
        if(projectile.position.y+ projectile.radius<=0){
            setTimeout(()=>{
                projectiles.slice(index,1)//retira o projectile na pos index
                
            },0)
        }else{
            projectile.update()
        }
    })

    grids.forEach((grid, gridIndex) => {
        grid.update()
        //spawning enemy projectiles
        if(frames %100 ===0 && grid.invaders.length>0){
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)    
        }

        grid.invaders.forEach((invader,i) => {
            invader.update({velocity: grid.velocity})
            //projectiles hit invader
            projectiles.forEach((projectile, j) =>{
                if(
                    projectile.position.y-projectile.radius<=
                    invader.position.y+invader.height && 
                    projectile.position.x+projectile.radius>=invader.position.x &&
                    projectile.position.x-projectile.radius<=invader.position.x + invader.width &&//o projetil tem de entrar em contacto com a parte de baixo do invader
                    projectile.position.y+projectile.radius>= invader.position.y
                ){//isto verifica se o tiro acertou no invader
                    
                    
                    setTimeout(()=>{
                        const invaderFound = grid.invaders.find((invader2) =>
                            invader2 === invader
                        )
                        const projectileFound = projectiles.find(
                            projectile2 => projectile2 === projectile)

                        if(invaderFound && projectileFound){//verifica se o projetil e o invader sao mesmo aos q nos referimos
                            score+=100
                            scoreEl.innerHTML=score

                            createParticles({
                                object:invader,
                                fades: true
                            })

                            grid.invaders.splice(i, 1)
                            projectiles.splice(j, 1)
                            if(grid.invaders.length>0){//tem em consideracao o tamanho da grid para n dar bounce cedo
                                const fristInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length-1]

                                grid.width = lastInvader.position.x-fristInvader.position.x + lastInvader.width
                                grid.position.x= fristInvader.position.x
                            }else{
                                grids.splice(gridIndex, 1) // ja n tem invaders na grid
                            }
                        }
                    },0)
                }
            })
        })
    })
    // *** movimento horizontal ***
    if(keys.a.pressed && player.position.x >=0 ){//anda esq ate limit
        player.velocity.x=-7
        player.rotation=-0.15//faz com que gire ligeiramente 
    } 
    else if(keys.d.pressed  && player.position.x+player.width<= canvas.width){//anda direita ate limit
        player.velocity.x = 7
        player.rotation=0.15
    }else{
        player.velocity.x=0
        player.rotation=0
    }
 // *** movimento vertical ***
    if(keys.w.pressed && player.position.y >=700 ){//anda cima ate limite
        player.velocity.y=-7
    }else if(keys.s.pressed && player.position.y+player.height<=canvas.height){//anda baixo ate limit
        player.velocity.y = 7
    }   
     else{
        player.velocity.y=0
    }
    //spawning enemies
    if(frames % random_interval === 0){ //se as frames sao divisiveis por 1000, ou seja a cada multiplo de mil frames
        grids.push(new Grid())
        random_interval = Math.floor((Math.random()*500)+500) 
        frames=0
    }


    frames++
}
animate()

addEventListener('keydown', ({key}) => {
    if(game.over) return
    switch (key){
        case 'a': 
            //console.log('left')
            keys.a.pressed = true
            break
        case 'w': 
            //console.log('up')
            keys.w.pressed = true
            break
        case 's': 
           // console.log('down')
            keys.s.pressed = true
            break
        case 'd': 
           // console.log('rght')
            keys.d.pressed = true
            break
        case ' ':
           // console.log('space')
            projectiles.push(
                new Projectile({
                    position: {
                        x: player.position.x+player.width/2,
                        y: player.position.y
                    },
                    velocity: {
                        x:0,
                        y:-10
                    }
                })
            )
           // console.log(projectiles)
            //keys.space.pressed = true 
            break
    }
})

addEventListener('keyup', ({key}) => {
    switch (key){
        case 'a': 
           // console.log('left')
            keys.a.pressed = false
            break
        case 'w': 
           // console.log('up')
            keys.w.pressed = false
            break
        case 's': 
           // console.log('down')
            keys.s.pressed = false
            break
        case 'd': 
           // console.log('rght')
            keys.d.pressed = false
            break
        case ' ':
          //  console.log('space')
            keys.space.pressed = false
            break
    }
})