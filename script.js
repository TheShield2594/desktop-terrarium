const plant = document.getElementById("plant");

/**
 * Create leaves
 */
const leftLeaf = document.createElement("div");
leftLeaf.className = "leaf left";

const rightLeaf = document.createElement("div");
rightLeaf.className = "leaf right";

plant.appendChild(leftLeaf);
plant.appendChild(rightLeaf);

/**
 * Terrarium state
 */
const terrarium = {
  growth: 40,
  maxGrowth: 90,
  mood: 0
};

/**
 * Organic growth:
 * grows stem first, then leaves subtly enlarge
 */
setInterval(() => {
  if (terrarium.growth < terrarium.maxGrowth) {
    terrarium.growth += Math.random() * 0.4;
    plant.style.height = terrarium.growth + "px";

    const leafScale = 1 + terrarium.growth / terrarium.maxGrowth * 0.2;
    leftLeaf.style.transform = `rotate(-25deg) scale(${leafScale})`;
    rightLeaf.style.transform = `rotate(25deg) scale(${leafScale})`;
  }
}, 1800);

/**
 * Microphone interaction
 */
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);

  const data = new Uint8Array(analyser.frequencyBinCount);

  function listen() {
    analyser.getByteFrequencyData(data);

    const volume =
      data.reduce((a, b) => a + b, 0) / data.length / 255;

    terrarium.mood = volume;

    if (volume > 0.12) {
      plant.classList.add("dance");
    } else {
      plant.classList.remove("dance");
    }

    requestAnimationFrame(listen);
  }

  listen();
});

/**
 * Calm breathing glow
 */
setInterval(() => {
  if (terrarium.mood < 0.08) {
    plant.style.filter = "brightness(1.1)";
    setTimeout(() => {
      plant.style.filter = "brightness(1)";
    }, 900);
  }
}, 4200);
