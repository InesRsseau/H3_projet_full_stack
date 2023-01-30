//POO ; création des personnages 
class character{
    constructor(pv, damage_shoot, damage_chase, speed, image){
        this.pv = pv;
        this.damage_shoot = damage_shoot;
        this.damage_chase = damage_chase;
        this.speed = speed;
        this.image = image;
    }
}

const player = new character(10,4,0,4,'/images/characters/student/persoface.png');
const shooter = new character(1,2,0,2,'/images/characters/seo.png'); 
const chaser = new character (3,0,1,4,'/images/characters/namiko.png'); 
const boubou = new character(6,2,2,1,'/images/characters/boubou.png'); 


//POO ; création d'items

class items{
    constructor(pv, damage, speed, image){
        this.pv = pv;
        this.damage = damage;
        this.speed = speed;
        this.image = image;
    }
}

const i_pc = new character(0,1,-1,'/images/items/pc.png');
const i_pingpong = new character(-1,1,0,'/images/items/pingpongraquette.png');
const i_scarf = new character(-1,1,0,'/images/items/scarf.png');
const i_diplome = new character(0,1,-1,'/images/items/diplome.png');

const i_hotdog = new character(1,0,-1,'/images/items/hotdog.png');
const i_bag = new character(1,-1,0,'/images/items/bag.png'); 
const i_costume = new character(1,0,-1,'/images/items/costume.png');
const i_chocolate = new character(1,0,-1,'/images/items/chocolate.png'); 

const i_switch = new character(0,-1,1,'/images/items/switch.png');
const i_skate = new character(-1,0,1,'/images/items/skate.png');
const i_coke = new character(-1,0,1,'/images/items/coke.png');
const i_chargeur = new character(0,-1,1,'/images/items/chargeur-degueu.png');
