# LittleBot

A simple Discord bot in node using discord.io

## Installation

`npm install`

## Usage

Copy default.conf to little.conf, and fill out the relevant fields (email, password, etc.)

`npm start`

###To add commands:

Using objects in JSON format:
```
{
  "admin": boolean,
  "args": string,
  "case": boolean,
  "exp": string,
  "func": string,
  "name": string,
  "special": boolean,
  "tts": boolean
}
```
Add the command to little.conf or type `lol add advanced {JSON Object}` in discord.

Simple 'say' commands can be added with `lol add input output` where input is the text to match, and output is the response from the bot.

###To remove commands:

Delete the command object from little.conf or type `lol remove name` in discord, where name can be the "name" field or the "exp" field of the command.