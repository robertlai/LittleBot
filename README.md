# LittleBot

A simple Discord bot created using node with discord.js

## Installation

`npm install`

## Usage

Copy config.sample to config.conf, and enter the relevant information (email, password, your discord user ID).

`npm start`

###To add commands:

Using objects in JSON format:
```
{
  "case": boolean,
  "in": string,
  "out": string,
  "name": string,
  "replace": [
    {
      "old": string,
      "new": string
    }
  ],
  "tts": boolean
}
```
Add the command to data.json or type `lol add advanced {JSON Object}` in discord.
`replace.new` can be a special value; one of: `$msg`, `$roll()`, `$now`, `$userid`, `$username`, which represent the input message, a random integer, the current time, the message author's id or username, respectively.

Simple 'say' commands can be added with `lol add input output` where input is the text to match, and output is the response from the bot.
Simple commands can be added with `-i` flag to mark as case insensitive, and `-n` flag to set a custom name.

Example usage:
```
lol add -i -n testName foo bar
```

###To remove commands:

Delete the command object from data.json or type `lol remove name` in discord, where name is the "name" of the command.