const Command = require('../Command');

module.exports = Command.extend({
    commandName: 'unmute',
    commandAliases: ['unban'],
    advertisable: false,
    processMessage: function (message, tokens) {
        let hasRoles = message.member !== null && typeof message.member.roles !== 'undefined';

        if (hasRoles && this.memberIsAdministrator(message.member)) {
            message.delete();

            let victim = message.mentions.members.first();

            if (tokens.length < 3 || !victim) {
                message.member.user.send('Please use the correct format: `' + tokens[0] + ' <@User#9999> <Reason>`.');
            }
            else {
                let reason = tokens.slice(2).join(' ');

                if (!reason || reason == '' || reason == null) {
                    message.member.user.send('Please use the correct format: `' + tokens[0] + ' <@User#9999> <Reason>`.');
                }
                else {
                    message.member.user.send({
                        embed: {
                            color: 0x66ff00,
                            author: {
                                name: this.discordClient.user.username,
                                icon_url: this.discordClient.user.avatarURL
                            },
                            title: "Successfully unmuted @" + victim.user.username + "#" + victim.user.discriminator,
                            fields: [
                                {
                                    name: "Unmute Reason",
                                    value: reason
                                }
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: this.discordClient.user.avatarURL,
                                text: "Shotbow Network Chat Bot"
                            }
                        }
                    });

                    victim.user.send({
                        embed: {
                            color: 0x66ff00,
                            author: {
                                name: this.discordClient.user.username,
                                icon_url: this.discordClient.user.avatarURL
                            },
                            title: "You have been unmuted on the Shotbow Discord",
                            fields: [
                                {
                                    name: "Friendly Reminder",
                                    value: "This is your last chance. If you are muted again, your appeal will not be considered."
                                }
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: this.discordClient.user.avatarURL,
                                text: "Shotbow Network Chat Bot"
                            }
                        }
                    })
                        .then(() => {
                            victim.removeRole(message.guild.roles.find('name', 'Muted'))
                                .catch(error => message.member.user.send('In addition, I was unable to remove their `Muted` role for some reason. My permissions may be messed up. Please contact a developer immediately.\n**Error: ** ```' + error + '```'));
                        })
                        .catch(error => message.member.user.send('In addition, I was unable to DM the banned user about their ban. It is likely that they have DMs disabled.'));

                    message.guild.channels.find('id', this.config.moderationLogsRoom).send({
                        embed: {
                            color: 0x66ff00,
                            author: {
                                name: message.member.user.username,
                                icon_url: message.member.user.avatarURL
                            },
                            title: "Unmuted @" + victim.user.username + "#" + victim.user.discriminator,
                            fields: [
                                {
                                    name: "Unmute Reason",
                                    value: reason
                                }
                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: this.discordClient.user.avatarURL,
                                text: "Shotbow Network Chat Bot"
                            }
                        }
                    });
                }
            }
        }
    },
    memberIsAdministrator: function (member) {
        for (let role in this.config.administratorRoles) {
            if (member.roles.has(this.config.administratorRoles[role])) {
                return true;
            }
        }
        return false;
    }
});
