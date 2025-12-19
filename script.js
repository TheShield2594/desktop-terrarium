const plant = document.getElementById("plant");

/**
 * Centralized terrarium state
 * (kept intentionally small)
 */
const terrarium = {
  growth: 42,
  maxGrowth: 96,
  mood: 0, // ambient sound level (0–1)
};

/**
 * Slow, organic growth
 * Growth stops visually but life continues
 */
setInterval(() => {
  if (terrarium.growth < terrarium.maxGrowth) {
    terrarium.growth += Math.random() * 0.35;
    plant.style.height = terrarium.growth + "px";
  }
}, 1600);

/**
 * Microphone-based ambient interaction
 * Smooth, non-binary response
 */
navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 256;

  const source = audioContext.createMediaStreamSource(stream);
  source.connect(analyser);

  const dataArray = new Uint8Array(analyser.frequencyBinCount);

  function listen() {
    analyser.getByteFrequencyData(dataArray);

    const average =
      dataArray.reduce((sum, value) => sum + value, 0) /
      dataArray.length /
      255;

    terrarium.mood = average;

    if (average > 0.12) {
      plant.classList.add("dance");
    } else {
      plant.classList.remove("dance");
    }

    requestAnimationFrame(listen);
  }

  listen();
});

/**
 * Subtle "breathing" when calm
 * Keeps the plant feeling alive during silence
 */
setInterval(() => {
  if (terrarium.mood < 0.08) {
    plant.style.filter = "brightness(1.08)";
    setTimeout(() => {
      plant.style.filter = "brightness(1)";
    }, 900);
  }
}, 4200);
