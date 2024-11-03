on("ready", function() {
    // Initialize state to track dispensed handouts
    if (!state.cogmindHandouts) {
        state.cogmindHandouts = {
            dispensed: [],
            totalHandouts: 0 // Keep track of the total number of handouts
        };
    }
});

on("chat:message", function(msg) {
    // Check if the message is an API command
    if (msg.type !== "api" || msg.content !== "!givehandout") return;

    const keyword = "Dungeon1:"; // Keyword to look for in the handout title
    const handouts = findObjs({ type: "handout" }); // Fetch all handouts
    const availableHandouts = handouts.filter(handout => 
        handout.get("name").toLowerCase().startsWith(keyword.toLowerCase())
    );

    // Initialize total handouts if it's not set
    if (state.cogmindHandouts.totalHandouts === 0) {
        state.cogmindHandouts.totalHandouts = availableHandouts.length;
    }

    // Check if all handouts have been dispensed
    if (state.cogmindHandouts.dispensed.length === state.cogmindHandouts.totalHandouts) {
        sendChat("API", "All handouts from Dungeon1 have already been dispensed.");
        return;
    }

    // Filter out already dispensed handouts
    const remainingHandouts = availableHandouts.filter(handout => 
        !state.cogmindHandouts.dispensed.includes(handout.id)
    );

    // Select a random handout from the remaining ones
    const randomIndex = randomInteger(remainingHandouts.length) - 1; // Roll a random index (1-based)
    const selectedHandout = remainingHandouts[randomIndex];

    // Add the handout to the dispensed list
    state.cogmindHandouts.dispensed.push(selectedHandout.id);

    // Change the handout visibility to all players
    selectedHandout.set("inplayerjournals", "all"); // Ensure it's accessible to all players

    // Notify players about the dispensed handout
    const handoutName = selectedHandout.get("name");
    sendChat("API", "A new handout has been dispensed: " + handoutName);

    // Optionally, send a whisper to the GM
    const gmPlayerId = getGmPlayerId();
    if (gmPlayerId) {
        sendChat("API", `/w "${getPlayerName(gmPlayerId)}" You have dispensed a handout: "${handoutName}".`);
    }
});

// Function to get the GM player ID
function getGmPlayerId() {
    const players = findObjs({ type: "player", is_gm: true });
    return players.length > 0 ? players[0].id : null; // Return the first GM's player ID
}

// Function to get player name
function getPlayerName(playerId) {
    const player = getObj("player", playerId);
    return player ? player.get("displayname") : "GM"; // Return the player's display name or "GM"
}
