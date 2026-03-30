const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");

let particles = [];
let explosions = [];

const num = 70;

/* ===== 鼠标 ===== */
let mouse = {
  x: null,
  y: null,
  radius: 200
};

window.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

window.addEventListener("mouseout", () => {
  mouse.x = null;
  mouse.y = null;
});

/* ===== 点击爆炸 ===== */
window.addEventListener("click", e => {
  createExplosion(e.clientX, e.clientY);
});

/* ===== 自适应 ===== */
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.onresize = resize;
resize();

/* ===== 基础粒子 ===== */
class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    this.vx = (Math.random() - 0.5) * 0.8;
    this.vy = (Math.random() - 0.5) * 0.8;

    this.size = Math.random() * 2 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    // 鼠标扰动
    if (mouse.x && mouse.y) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouse.radius) {
        let force = (mouse.radius - dist) / mouse.radius;
        this.x -= dx * force * 0.05;
        this.y -= dy * force * 0.05;
      }
    }
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    ctx.fillStyle = "#00d4ff";
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#00d4ff";

    ctx.fill();
  }
}

/* ===== 爆炸粒子 ===== */
class ExplosionParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 4 + 1;

    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;

    this.life = 100;
    this.size = Math.random() * 3 + 1;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    this.vx *= 0.96;
    this.vy *= 0.96;

    this.life--;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

    ctx.fillStyle = "rgba(0,212,255," + this.life / 100 + ")";
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#00d4ff";

    ctx.fill();
  }
}

/* ===== 创建爆炸 ===== */
function createExplosion(x, y) {
  for (let i = 0; i < 30; i++) {
    explosions.push(new ExplosionParticle(x, y));
  }
}

/* ===== 初始化 ===== */
function init() {
  particles = [];
  for (let i = 0; i < num; i++) {
    particles.push(new Particle());
  }
}
init();

/* ===== 连线 ===== */
function connect() {
  for (let i = 0; i < num; i++) {
    for (let j = i + 1; j < num; j++) {
      let dx = particles[i].x - particles[j].x;
      let dy = particles[i].y - particles[j].y;
      let d = Math.sqrt(dx * dx + dy * dy);

      if (d < 120) {
        ctx.strokeStyle = "rgba(0,212,255," + (1 - d / 120) + ")";
        ctx.lineWidth = 0.6;

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

/* ===== 动画 ===== */
function animate() {

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 基础粒子
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  connect();

  // 爆炸粒子
  explosions.forEach((p, index) => {
    p.update();
    p.draw();

    if (p.life <= 0) {
      explosions.splice(index, 1);
    }
  });

  requestAnimationFrame(animate);
}

animate();

/* ===== 邮箱 ===== */
function openEmail() {
  const user = "hli0203";
  const domain = "gmail.com";
  const url = "https://mail.google.com/mail/?view=cm&to=" + user + "@" + domain;
  window.open(url, "_blank");
}

