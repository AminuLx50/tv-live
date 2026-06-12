const video = document.getElementById("video");
const channelList = document.getElementById("channelList");
const search = document.getElementById("search");

let channels = [];
let hls = null;

function playChannel(url) {
    if (hls) {
        hls.destroy();
        hls = null;
    }

    if (Hls.isSupported()) {
        hls = new Hls();

        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, function () {
            video.play().catch(err => console.log(err));
        });

        hls.on(Hls.Events.ERROR, function (event, data) {
            console.error("HLS Error:", data);
        });

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.play().catch(err => console.log(err));
    }
}

function renderChannels(data) {
    channelList.innerHTML = "";

    data.forEach(channel => {
        const div = document.createElement("div");
        div.className = "channel";

        div.innerHTML = `
            <img src="${channel.logo}" class="channel-logo" alt="${channel.name}">
            <span>${channel.name}</span>
        `;

        div.onclick = () => playChannel(channel.url);

        channelList.appendChild(div);
    });
}

fetch("channels.json")
    .then(response => response.json())
    .then(data => {
        channels = data;
        renderChannels(channels);

        if (channels.length > 0) {
            playChannel(channels[0].url);
        }
    })
    .catch(error => {
        console.error("JSON Load Error:", error);
    });

search.addEventListener("input", () => {
    const keyword = search.value.toLowerCase();

    const filtered = channels.filter(channel =>
        channel.name.toLowerCase().includes(keyword)
    );

    renderChannels(filtered);
});