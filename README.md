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
  "special": boolean,
  "tts": boolean
}
```
Edit little.conf or type `lol add advanced {JSON Object}` in discord.

Simple 'say' commands can be added with `lol add input output` where input is the text to match (exactly), and output is the response from the bot.