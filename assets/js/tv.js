window.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
    setTimeout(callback, 1000 / 60);
};
window.onerror = function (message, file, line) {
    return false;
};
Array.prototype.shuffle = function () {
    var j,
    temp;
    for (var i = this.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
    }
    return this;
};
var TV = (function () {
    var TV = {},
    TV_WIDTH = 800,
    TV_HEIGHT = 450,
    video,
    videoWidth = TV_WIDTH,
    videoHeight = TV_HEIGHT,
    videoIndex = 0,
    videoLoading = true,
    videoTimeoutID,
    canvas,
    canvasWidth = TV_WIDTH,
    canvasHeight = TV_HEIGHT,
    canvasLeft = 0,
    canvasTop = 0,
    context,
    testcard = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAoAAAAHMBAMAAAC3kQSaAAAAJ1BMVEUTExMA////AP/MzMwAAP//AAAA/wD//wA6AH4IPln///8mJiYAAAAA8K98AAACnUlEQVR42u3TMRGDQABEUS4OsIAFIuEiAS9YSawECWjAAhZSQ7fHpGDm/Y5hr+DNUcYuqUbrT7SeovUSrbOv3IPto9OlAAIECBCgAAIECFAAAQIEKIAAAQIUQIAAAQogQIAABRAgQIACCBAgQAEECBCgAAIECFAAAQIECFAAAQIEKIAAAQIUQIAAAQogQIAABRAgQIACCBAgQAEECBCgAAIECFAAAQIEKIAAAQIUQIAAAQIUQIAAAQogQIAABRAgQIACCBAgQAEECBCgAAIECFAAAQIEKIAAAQIUQIAAAQogQIAAAQogQIAABRAgQIACCBAgQAEECBCgAAIECFAAAQIEKIAAAQIUQIAAAQogQIAABRAgQIACCBAgQIACCBAgQAEECBCgAAIECFAAAQIEKIAAAQIUQIAAAQogQIAABRAgQIACCBAgQAEECBAgQAEECBCgAAIECFAAAQIEKIAAAQIUQIAAAQogQIAABRAgQIACCBAgQAEECBCgAAIECFAAAQIECFAAAQIEKIAAAQIUQIAAAQogQIAABRAgQIACCBAgQAEECBCgAAIECFAAAQIEKIAAAQIEKIAAAQIUQIAAAQogQIAABRDgXSo1mi/ReojWW7Tuo/UerUc30C8MEKAAAgQIUAABAgQogAABAhRAgAABCiBAgAAFECBAgAIIECBAgAIIECBAAQR4v8q78WDfeG5rPDdf+sz18PQ8vf2enl9uoF8YIEABBAgQoAACBAhQAAECBCiAAAECFECAAAEKIECAAAUQIECAAAUQIECAAggQIEABBAgQoAACBAhQAAECBCiAAAECFECAAAEKIECAAAUQIECAAggQIECAAggQIEABBAgQoAACBAhQAAECBCiAAAECFECAAAEK4L/6AZvFDg1SgpktAAAAAElFTkSuQmCC',
    testcardImage,
    testcardCanvas,
    testcardContext,
    tempCanvas,
    tempContext,
    tinyCanvas,
    tinyContext,
    testcardMod = 0,
    pixelOffset1,
    pixelOffset2,
    blockOffset,
    audio = {},
    audioContext,
    init = false;
    function beep() {
        document.getElementById('beep').play();
    }
    function getCanvasRatio() {
        var body = document.body,
        html = document.documentElement,
        width = Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth),
        height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
        return width / height;
    }
    function resizeCanvas() {
        var canvasRatio = getCanvasRatio(),
        videoRatio = videoWidth / videoHeight,
        overscan = 1;
        if (canvasRatio < videoRatio - 0.5) {
            overscan = 1.6;
        } else if (canvasRatio > videoRatio + 0.75) {
            overscan = 0.8;
        }
        canvasWidth = canvas.width * overscan;
        canvasHeight = canvas.height * overscan * canvasRatio / videoRatio;
        canvasLeft = (canvas.width - canvasWidth) / 2;
        canvasTop = (canvas.height - canvasHeight) / 2;
    }
    function loadNextVideo() {
        videoLoading = true;
        testcardContext.drawImage(testcardImage, 0, 0, testcardCanvas.width, testcardCanvas.height);
        pixelOffset1 = Math.floor(Math.random() * 3) + 1;
        pixelOffset2 = Math.floor(Math.random() * 3) + 1;
        blockOffset = Math.floor(Math.random() * 150) + 2;
        playAudio('blip');
        //beep();
        if (!TV.playlist || TV.playlist.length < 2) {
            return;
        }
        videoIndex++;
        videoIndex %= TV.playlist.length;
        videoName = TV.playlist[videoIndex];
        video.src = '/assets/videos/' + videoName + '.mp4';
        video.load();
    }
    function drawVideo() {
        var lineOffset = Math.round((Math.random() - 0.5) * 6);
        if (videoLoading) {
            testcardMod++;
            testcardMod %= 3;
            if (testcardMod === 0) {
                var imageData = testcardContext.getImageData(0, 0, testcardCanvas.width, testcardCanvas.height),
                pixels = imageData.data,
                length = pixels.length,
                offset,
                i = 0,
                x,
                y;
                for (y = 0; y < testcardCanvas.height; y++) {
                    offset = (y % ((Math.random() * blockOffset) | 0) === 0) ? ((Math.random() * lineOffset * lineOffset) | 0) : offset;
                    for (x = 0; x < testcardCanvas.width; x++) {
                        i += 4;
                        pixels[i] = pixels[i + pixelOffset1 * (offset + lineOffset * lineOffset)];
                        pixels[i + pixelOffset1] = pixels[i + pixelOffset2 + 4 * (offset * lineOffset)];
                    }
                }
                tempContext.putImageData(imageData, 0, 0);
                context.clearRect(0, 0, canvas.width, canvas.height);
                context.drawImage(tempCanvas, 0, 0, canvas.width, canvas.height);
            }
        } else {
            context.clearRect(0, 0, canvas.width, canvas.height);
            try {
                tinyContext.drawImage(video, 0, 0, tinyCanvas.width, tinyCanvas.height);
                tinyContext.fillStyle = 'rgba(0, 0, 0, 0.4)';
                tinyContext.fillRect(0, 0, tinyCanvas.width, tinyCanvas.height);
                context.drawImage(tinyCanvas, 0, 0, canvas.width, canvas.height);
                context.drawImage(video, canvasLeft, canvasTop, canvasWidth, canvasHeight);
            } catch (e) {}
        }
        requestAnimationFrame(drawVideo);
    }
    function playVideo() {
        videoLoading = false;
        videoWidth = video.videoWidth || TV_WIDTH;
        videoHeight = video.videoHeight || TV_HEIGHT;
        resizeCanvas();
        var promise = video.play();
        if (promise !== undefined) {
            promise.catch(function (error) {
                var play = document.querySelector('.autoplay');
                play.style.display = 'block';
                play.onmousedown = function (event) {
                    play.style.display = 'none';
                    playVideo();
                };
            });
        }
    }
    function loadAudio(name) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/assets/audio/' + name + '.mp3', true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = function () {
            audioContext.decodeAudioData(xhr.response, function (buffer) {
                audio[name] = buffer;
            }, function () {});
        };
        xhr.send();
    }
    function playAudio(name) {
        if (!audio[name]) {
            return;
        }
        if (audioContext && audioContext.resume) {
            audioContext.resume();
        }
        var source = audioContext.createBufferSource();
        source.buffer = audio[name];
        source.connect(audioContext.destination);
        if (source.start) {
            source.start(0);
        } else {
            source.noteOn(0);
        }
    }
    TV.init = function () {
        if (init) {
            return;
        }
        init = true;
        canvas = document.querySelector('.tv');
        testcardImage = new Image();
        testcardImage.src = testcard;
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        if (window.AudioContext) {
            audioContext = new AudioContext();
            loadAudio('blip');
            //beep();
        }
        video = document.createElement('video');
        video.setAttribute('playsinline', 'playsinline');
        video.title = 'Temaisgame.TV';
        video.autoPlay = false;
        video.loop = false;
        video.muted = false;
        video.oncanplaythrough = function () {
            clearTimeout(videoTimeoutID);
            videoTimeoutID = setTimeout(playVideo, 200);
        };
        video.onstalled = video.onerror = function () {
            clearTimeout(videoTimeoutID);
            videoTimeoutID = setTimeout(loadNextVideo, 500);
        };
        video.onended = loadNextVideo;
        video.load();
        window.onresize = resizeCanvas;
        canvas.width = TV_WIDTH;
        canvas.height = TV_HEIGHT;
        canvas.oncontextmenu = function (event) {
            event.preventDefault();
        };
        testcardCanvas = document.createElement('canvas');
        testcardCanvas.width = canvas.width / 2;
        testcardCanvas.height = canvas.height / 2;
        tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width / 2;
        tempCanvas.height = canvas.height / 2;
        tinyCanvas = document.createElement('canvas');
        tinyCanvas.width = 3;
        tinyCanvas.height = 3;
        var alt = document.querySelector('.alt');
        try {
            context = canvas.getContext('2d');
            tempContext = tempCanvas.getContext('2d');
            tinyContext = tinyCanvas.getContext('2d');
            tinyContext.globalAlpha = 0.1;
            testcardContext = testcardCanvas.getContext('2d');
        } catch (e) {
            alt.style.display = 'block';
            return;
        }
        canvas.onmousedown = loadNextVideo;
        if (document.body.className === 'disabled') {
            alt.style.display = 'block';
            TV.playlist = [];
        }
        if (TV.playlist) {
            TV.playlist.shuffle();
        }
        drawVideo();
        clearTimeout(videoTimeoutID);
        videoTimeoutID = setTimeout(loadNextVideo, 100);
    };
    return TV;
})();
document.addEventListener('DOMContentLoaded', TV.init);