var ls = require("./ls");
var simpjs = require("./simplify");

function jackpotStart(args, ifprofile, prefix, message) {
    var guildIdentifier = message.guild.id + "jackpotGame";
    var guildId = guildIdentifier;
    var bet = args[0];
    if (!bet || typeof bet != "number" || bet < 1 || bet <= Number(ifprofile)) {
        return `Please specify a valid bet that is less than or equal to your current balance. Check with ${prefix}balance.`; 
    }
    else if (!ifprofile) {
        return `Create a profile first with ${prefix}create`;
    }
    if (ls.exist(guildId)) {
        //Jackpot object already exists
        if (ls.getObj(guildId).isEnabled) {
            //Jackpot game is already running, join it
            var jackpotObj = ls.getObj(guildId);
            var isAlreadyIn = jackpotObj.participants.includes(message.author.id);
            if (isAlreadyIn) {
                //Add to value, not create a new one
                var index = jackpotObj.participants.indexOf(message.author.id);
                jackpotObj.bets[index] += bet;
                var total = jackpotObj.bets.reduce((a,b) => Number(a) + Number(b), 0);
                ls.setObj(guildId, jackpotObj);
                return `${message.author.username}, you added $${bet} more to the jackpot! Total jackpot value: **$${total}**`;
            }
            else {
                //Add new value
                var jackpotObj = ls.getObj(guildId);
                jackpotObj.participants.push(message.author.id);
                jackpotObj.bets.push(bet);
                var total = jackpotObj.bets.reduce((a,b) => Number(a) + Number(b), 0);
                ls.setObj(guildId, jackpotObj);
                return `${message.author.username}, you joined the jackpot with $${bet}! Total jackpot value: **$${total}**`;
            }
        }
        else {
            //ERROR, not possible
            return `Error 203: jackpotObj.isEnabled should be set to true, but is not defined.`;
        }
    }
    else {
        //Jackpot object must be created
        var jackpotObj = {
            isEnabled = true,
            participants: [],
            bets: []
        }
        jackpotObj.participants.push(message.author.id);
        jackpotObj.bets.push(bet);
        ls.setObj(guildId, jackpotObj);
        return `${message.author.username}, you created a new jackpot with **$${bet}**`;
    }
}

function jackpotEnd(message) {
    var jackpotObj = ls.getObj(message.guild.id + "jackpotGame");
    if (simpjs.discrim(message.member) || jackpotObj.participants[0] == message.author.id) {
        //End the jackpot game
        var total = jackpotObj.bets.reduce((a,b) => Number(a) + Number(b), 0);
        var jackpotLength = jackpotObj.participants.length;
        if (jackpotLength == 1) {
            return `Sorry ${message.author.username}, nobody joined your jackpot game.`;
        }
        else {
            var randWinner = Math.floor(Math.random() * jackpotLength);
            var winner = jackpotObj.participants[randWinner];
            ls.set(winner + "profile", Number(ls.get(winner + "profile")) + Number(total));
            var winnerUsername = message.guild.fetchMember({ id: winner }).username;
            return `Lucky ${winnerUsername}, you won the jackpot with a gain of **$${total}!**`;
        }
    }
    else {
        //Doesn't have admin perms or isn't the creator of the jackpot
        return `${message.author.username}, **you cannot end the jackpot**, as you are neither the creator of the jackpot session nor an administrator in this guild.`;
    }
}

module.exports = {
    start: jackpotStart,
    end: jackpotEnd
}