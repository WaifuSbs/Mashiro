module.exports = {
    getKaomoji: () => {
        const kaomoji = require("./kaomoji.json");
        var i = Math.floor(Math.random() * kaomoji.kaomoji.length);
        var kaomojiName = kaomoji.kaomoji[i];
        return kaomojiName;
    }
}