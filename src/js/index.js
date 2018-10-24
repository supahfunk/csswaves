import 'babel-polyfill';
import './../sass/styles.scss';


/*--------------------
Mouse
--------------------*/
let time = 0;
let leaveTimeout;
let leave = true;
let mouse = {
  x: window.innerWidth / 2 + Math.cos(time) * window.innerWidth / 2,
  y: window.innerHeight / 2,
};
const onMouseMove = (e) => {
  clearTimeout(leaveTimeout);
  leave = false;
  mouse = {
    x: e.clientX || e.pageX || e.touches[0].pageX || 0,
    y: e.clientY || e.pageY || e.touches[0].pageY || 0
  };
};
['mousemove', 'touchmove'].forEach(event => {
  window.addEventListener(event, onMouseMove);
});
document.body.addEventListener('mouseleave', () => {
  leaveTimeout = setTimeout(() => {
    leave = true;
    time = 0;
  }, 1000);
});


/*--------------------
Distance
--------------------*/
const checkDistance = (x, y) => {
  const diffX = mouse.x - x;
  const diffY = mouse.y - y;
  return Math.sqrt(diffX * diffX + diffY * diffY);
}


/*--------------------
Render
--------------------*/
let radius = .4;
let maxHeight = 150;
let minHeight = 0;
let lastCalledTime;
let fps;
const divs = Array.prototype.slice.call(document.querySelectorAll('.cube__small'));
divs.forEach(d => {
  d.oldHeight = 0;
});
const render = () => {
  time += 0.1;
  window.requestAnimationFrame(render);

  if (leave) {
    if (Math.cos(time) < -0.99) {
      time = 0;
    }
    mouse = {
      x: window.innerWidth / 2 - Math.cos(time) * window.innerWidth / 2,
      y: window.innerHeight / 2,
    };
  }

  divs.forEach(d => {
    const bounds = d.getBoundingClientRect();
    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    const dist = checkDistance(centerX, centerY);
    const height = Math.min(maxHeight, minHeight + maxHeight * dist / maxHeight - dist * radius);
    const translate = d.oldHeight + (height - d.oldHeight) * 0.6;
    d.style = `--h: ${translate}px;`;
    d.oldHeight = translate;
  });

  /*-----------------------------------
  Decomment for scene interaction
  -----------------------------------*/
  //document.querySelector('.scene').style.transform = `rotateX(60deg) rotateZ(${15 + mouse.x / 30}deg)`;
}
render();