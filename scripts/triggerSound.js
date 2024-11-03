// Roll20 Script to Play a Song When a Player Walks Over a Trigger Token
on('change:graphic', function(obj, prev) {
    // Only trigger when a player-controlled token is moved
    if (obj.get('subtype') === 'token' && obj.get('controlledby')) {
        // Define the trigger token
        const triggerToken = findObjs({
            _type: 'graphic',
            _pageid: obj.get('_pageid'),
            name: 'Trigger - Door1', // Replace with your specific trigger token name
            layer: 'gmlayer'
        })[0];
        
        if (!triggerToken) return; // Exit if trigger token is not found

        // Check if player token has entered the trigger area
        const distance = Math.sqrt(
            Math.pow(obj.get('left') - triggerToken.get('left'), 2) +
            Math.pow(obj.get('top') - triggerToken.get('top'), 2)
        );
        const tokenRadius = Math.max(obj.get('width'), obj.get('height')) / 2;
        
        if (distance <= tokenRadius) {
            // Play the designated song from the jukebox
            let jukeboxTrack = findObjs({
                _type: 'jukeboxtrack',
                title: 'Your Song Title Here' // Replace with your song title
            })[0];

            // Ensure the track is found
            if (jukeboxTrack) {
                // Set the track to play and start
                jukeboxTrack.set({ playing: true, softstop: false });
                sendChat("GM", "/w GM Player has triggered the song by walking over the trigger token!");
            } else {
                sendChat("GM", "/w GM Error: Could not find the track in the jukebox.");
            }

            // Optional: Move or hide the trigger token to prevent retriggering
            triggerToken.set('layer', 'map'); // Move to map layer after trigger
        }
    }
});
