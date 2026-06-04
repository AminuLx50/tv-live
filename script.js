const video = document.getElementById("video");
const channelList = document.getElementById("channelList");

let channels = [];

fetch("channels.json")
.then(res => res.json())
.then(data => {

    channels = data;

    renderChannels(data);

});

function renderChannels(data){

    channelList.innerHTML = "";

    data.forEach(channel => {

        const div = document.createElement("div");

        div.className = "channel";

        div.innerHTML = channel.name;

        div.onclick = () => playChannel(channel.url);

        channelList.appendChild(div);

    });

}

function playChannel(url){

    if(Hls.isSupported()){

        const hls = new Hls();

        hls.loadSource(url);

        hls.attachMedia(video);

    }else{

        video.src = url;

    }

}

document
.getElementById("search")
.addEventListener("input", e => {

    const value = e.target.value.toLowerCase();

    const filtered = channels.filter(ch =>
        ch.name.toLowerCase().includes(value)
    );

    renderChannels(filtered);

});