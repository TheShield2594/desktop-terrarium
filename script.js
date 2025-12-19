let growth = 0;
let isDancing = false;
const plant = document.getElementById('plant');
const growthText = document.getElementById('growth-percent');
const weatherTag = document.getElementById('weather-tag');

// 1. Weather Logic
async function updateWeather() {
    // In a real app, you'd fetch from an API. 
    // Here, we simulate based on time of day.
    const hours = new Date().getHours();
    if (hours > 18 || hours < 6) {
        weatherTag.innerText = "Weather: Night (Slow Growth)";
        document.documentElement.style.setProperty('--leaf-color', '#5c6bc0');
    } else {
        weatherTag.innerText = "Weather: Sunny (Mutation Chance!)";
        document.documentElement.style.setProperty('--leaf-color', '#81c784');
    }
}

// 2. Audio Reactivity Logic
document.getElementById('start-mic').addEventListener('click', async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    source.connect(analyser);

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function checkVolume() {
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        let average = sum / dataArray.length;

        // If volume is high, start dancing and boost growth
        if (average > 40) {
            if (!isDancing) {
                plant.classList.add('dancing');
                isDancing = true;
            }
            growth += 0.05; // Music makes it grow faster!
        } else {
            plant.classList.remove('dancing');
            isDancing = false;
            growth += 0.01;
        }

        growthText.innerText = Math.floor(growth);
        
        // Visual growth scaling
        const scale = 1 + (growth / 100);
        plant.style.transform = `translateX(-50%) scale(${scale})`;

        requestAnimationFrame(checkVolume);
    }

    checkVolume();
    document.getElementById('start-mic').style.display = 'none';
});

updateWeather();