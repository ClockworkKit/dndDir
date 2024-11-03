// Time Delay Dice Roller Script with Countdown for Roll20
on('chat:message', function(msg) {
    // Only proceed if the message is an API command and starts with !delayroll
    if (msg.type === 'api' && msg.content.startsWith('!delayroll')) {
        // Extract arguments from the command
        const args = msg.content.split(' ');
        
        // Check if enough arguments are provided
        if (args.length < 3) {
            sendChat('System', '/w ' + msg.who + ' Usage: !delayroll [dice] [delay in seconds]');
            return;
        }
        
        // Extract dice expression and delay time
        const diceExpression = args[1];
        let delayTime = parseInt(args[2]);

        // Validate the delay time
        if (isNaN(delayTime) || delayTime <= 0) {
            sendChat('System', '/w ' + msg.who + ' Please enter a valid delay time in seconds.');
            return;
        }

        // Roll the dice expression
        sendChat(msg.who, `/roll ${diceExpression}`, function(ops) {
            const rollResult = JSON.parse(ops[0].content);
            const total = rollResult.total;

            // Announce the initial countdown message
            sendChat('System', `/w ${msg.who} Rolling ${diceExpression}... Result will reveal in **${delayTime}** seconds.`);

            // Start the countdown timer
            let countdownInterval = setInterval(() => {
                delayTime--;

                if (delayTime > 0) {
                    // Update the countdown each second
                    sendChat('System', `/w ${msg.who} Result will reveal in **${delayTime}** seconds...`);
                } else {
                    // Time's up! Reveal the result
                    clearInterval(countdownInterval);
                    sendChat('System', `/w ${msg.who} 🎲 The result of ${diceExpression} is: **${total}**`);
                }
            }, 1000);
        });
    }
});
