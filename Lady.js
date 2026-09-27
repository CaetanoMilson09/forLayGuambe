const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width;
let height;

let particles = [];


// ==========================================
// CONFIGURAÇÕES
// ==========================================

const PARTICLE_COUNT = 1800;

const COLORS = [
    "#ff00bf",
    "#ff00ea",
    "#eb2588",
    "#f63bbe",
    "#fa60ed",
    "#fd93f8"
];


// ==========================================
// TAMANHO DO CANVAS
// ==========================================

function resizeCanvas() {

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);


// ==========================================
// CLASSE PARTICLE
// ==========================================

class Particle {

    constructor(x, y) {

        this.x = x;
        this.y = y;

        // Posição original do coração
        this.targetX = x;
        this.targetY = y;

        // Pequena variação da posição
        this.offsetX = (Math.random() - 0.5) * 3;
        this.offsetY = (Math.random() - 0.5) * 3;

        // Tamanho
        this.size = Math.random() * 2 + 0.5;

        // Velocidade
        this.speed = Math.random() * 0.03 + 0.01;

        // Cor
        this.color =
            COLORS[Math.floor(Math.random() * COLORS.length)];

        // Brilho
        this.alpha = Math.random() * 0.7 + 0.3;

        // Fase da animação
        this.angle = Math.random() * Math.PI * 2;
    }


    update() {

        this.angle += this.speed;

        // Movimento suave em torno da posição original
        const floatingX =
            Math.cos(this.angle) * 0.8;

        const floatingY =
            Math.sin(this.angle) * 0.8;


        // Movimento em direção ao coração
        this.x +=
            (this.targetX + floatingX - this.x) * 0.04;

        this.y +=
            (this.targetY + floatingY - this.y) * 0.04;

    }


    draw() {

        ctx.beginPath();

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = this.color;

        ctx.globalAlpha = this.alpha;

        ctx.shadowBlur = 8;

        ctx.shadowColor = this.color;

        ctx.fill();

        ctx.globalAlpha = 1;

    }

}


// ==========================================
// FUNÇÃO DO CORAÇÃO
// ==========================================

function heartPosition(t, scale) {

    /*
        Fórmula matemática do coração:

        x = 16 sin³(t)

        y = 13 cos(t)
            - 5 cos(2t)
            - 2 cos(3t)
            - cos(4t)
    */

    const x =
        16 *
        Math.pow(Math.sin(t), 3);

    const y =
        13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);


    return {

        x: x * scale,

        y: -y * scale

    };

}


// ==========================================
// CRIAR PARTÍCULAS
// ==========================================

function createParticles() {

    particles = [];


    // Escala responsiva

    const scale =
        Math.min(width, height) / 32;


    for (let i = 0; i < PARTICLE_COUNT; i++) {

        const t =
            Math.random() * Math.PI * 2;


        const heart =
            heartPosition(t, scale);


        // Adiciona uma pequena variação
        // para preencher o interior

        const randomScale =
            Math.sqrt(Math.random());


        const targetX =
            width / 2 +
            heart.x * randomScale;


        const targetY =
            height / 2 +
            heart.y * randomScale;


        // Começa espalhado
        // e depois vai para o coração

        const startX =
            width / 2 +
            (Math.random() - 0.5) * width;


        const startY =
            height / 2 +
            (Math.random() - 0.5) * height;


        const particle =
            new Particle(startX, startY);


        particle.targetX = targetX;
        particle.targetY = targetY;


        particles.push(particle);

    }

}


// Criar inicialmente

createParticles();


// ==========================================
// DESENHAR
// ==========================================

function draw() {

    // Fundo preto
    ctx.fillStyle = "rgba(0, 0, 0, 0.25)";

    ctx.fillRect(
        0,
        0,
        width,
        height
    );


    // Atualizar partículas

    for (const particle of particles) {

        particle.update();

        particle.draw();

    }


    requestAnimationFrame(draw);

}


// ==========================================
// INICIAR ANIMAÇÃO
// ==========================================

draw();


// ==========================================
// RECRIAR AO REDIMENSIONAR
// ==========================================

window.addEventListener("resize", () => {

    resizeCanvas();

    createParticles();

});