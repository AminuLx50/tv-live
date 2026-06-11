const video = document.getElementById("video");
const channelList = document.getElementById("channelList");
const search = document.getElementById("search");

let channels = [];
let hls = null;

function playChannel(url) {
    if (hls) {
        hls.destroy();
    }

    if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.play().catch(() => {});
        });

    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = url;
        video.play().catch(() => {});
    }
}

function renderChannels(data) {
    channelList.innerHTML = "";

    if (data.length === 0) {
        channelList.innerHTML = "<p style='padding:15px'>No channels found</p>";
        return;
    }

    data.forEach(channel => {
        const div = document.createElement("div");
        div.className = "channel";

        div.innerHTML = `
            <img src="${channel.logo}" class="channel-logo" alt="${channel.name}">
            <span>${channel.name}</span>
        `;

        div.addEventListener("click", () => {
            playChannel(channel.url);
        });

        channelList.appendChild(div);
    });
}

fetch("./channels.json")
    .then(res => {
        if (!res.ok) {
            throw new Error("channels.json not found");
        }
        return res.json();
    })
    .then(data => {
        channels = data;

        renderChannels(channels);

        if (channels.length > 0) {
            playChannel(channels[0].url);
        }
    })
    .catch(err => {
        console.error(err);

        channelList.innerHTML = `
            <div style="padding:15px;color:red">
                Failed to load channels.json
            </div>
        `;
    });

search.addEventListener("input", () => {
    const value = search.value.toLowerCase();

    const filtered = channels.filter(channel =>
        channel.name.toLowerCase().includes(value)
    );

    renderChannels(filtered);
});