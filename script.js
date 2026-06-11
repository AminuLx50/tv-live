function renderChannels(data) {
    channelList.innerHTML = "";

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