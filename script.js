function renderChannels(data){

    channelList.innerHTML = "";

    data.forEach(channel => {

        const div = document.createElement("div");

        div.className = "channel";

        div.innerHTML = `
            <img src="${channel.logo}" class="channel-logo">
            <span>${channel.name}</span>
        `;

        div.onclick = () => playChannel(channel.url);

        channelList.appendChild(div);

    });

}