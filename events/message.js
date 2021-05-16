module.exports = {
    once: false,
    run(message) {
        return;
        if (message.content === "foo") {
            message.channel.send("you said foo");
        }
    }
};