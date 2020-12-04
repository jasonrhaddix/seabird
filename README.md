<p align="center"><img width=50% src="https://raw.githubusercontent.com/jasonrhaddix/seabird/master/assets/images/seabird-logo.png"></p>


## Overview


Seabird is a command line tool that adds automation for the Vue ecosystem. Its main functionality is to generate templates using [ejs](https://ejs.co/) with either user supplied or default internal data.

>Currently Seabird can only genterate Vue components and views, however, we are adding Vue-router modules, routes, Vuex modules, and vuex actions very soon.


## Status
__`Alpha`__  This project is currently in alpha phase. 

Some features may break between releases, and others may be removed entirely. Look to the __Feature Status__ section below to see which phase a current feature is in. 

I am not currently accepting pull requests. However, if you'd like a feature added, please submit an issue in GitHub as a feature request.


## Installation
To use Seabird in any directory be sure to install globally.

```bash
npm i seabird -g
```



## Commands
| Command       | Shorthand    | Description                           |
| ------------- |:------------:| --------------------------------------|
| init          | i            | Initializes a new Vue project         |
| create        | c            | Create ecosystem components           |
| config        |              | Creates or modifies config file       |



## Init
```bash
seabird init [options]
```
Initializing a new project is done with the `init` command. Seabird will prompt you with an option for initializing a project from a template or from new using the underlying Vue CLI.

__Options__

| Option             | Shorthand      | Description                                    |
| ------------------ |:-------------------:| ------------------------------------------|
| --template         | t                   | Download a project from a Git repo        |
| --new              | n                   | Create a new project using Vue CLI        |
| --config           | c                   | Creates a config file after app init      |

__template__ and __new__ flags are conflicting options, and only one must be passed at a time. If neither options are passed, you will be prompted to choose between the two.

_To create a new project, Vue CLI will need to be installed on your machine. If the Vue CLI is not installed you will be prompted to install before continuing._

##Sub-Commands

Subcommands are grouped to make targeting the correct subcommand easier.

For example, if you want to create a new Vue component you need to call the `create` command with the `vue` subcommand targeting the Vue library, and then the `component` subcommand to create a Vue component.


__Example__
`seabird create vue component <file-path> [...options]`

Calling `--help` at any level will output subcommands and options and will help you format your commands correctly.

__Arguments__ 

Almost all subcommands will have arguments that are either `<required>` or `[optional]`. Seabird will normally try to make assumptions or set defaults when optional arguments are not supplied. If required arguments are not supplied Seabird will abort the command.


####Create Commands

####Vue `vue`
__Subcommands__
Example: `seabird create vue <vue-subcommand>`

| Subcommand      | Arguments          | Description                          |
| --------------- |:------------------:| -------------------------------------|
| component       | `<file-path>`      | Create a new Vue component           |
| view            |  `<file-path>`     | Create a new Vue view                |

__Options__
Example: `seabird create vue component <file-path> --vuex-map --no-scoped-styles`

| Option              |  Negateable           | Default     | Description                                  |
| ------------------- | --------------------- | ----------- | -------------------------------------------- |
| --vuex-map          |  --no-vuex-map        | false       | Adds Vuex maps                               |
| --hooks             | --no-hooks            | false       | Adds Vue lifecycle hooks                     |
| --scoped-styles     | --no-scoped-styles    | true        | Adds `scoped` attribute to style tag         |
| --css-lang          |                       | 'css'       | Sets the `lang` attribute value on style tag |

---
####Vuex `vuex`
__Subcommands__
Example: `seabird create vuex <vue-subcommand>`

| Subcommand     | Arguments          | Description                                |
| -------------- |:------------------:| -------------------------------------------|
| module         | `<file-path>`      | Create a new Vuex module                   |
| action         |  `<file-path>`     | Create a new Vuex action inside a module   |

####Vue-Router `router`
__Subcommands__
Example: `seabird create router <vue-subcommand>`

| Subcommand     | Arguments         | Description                                     |
| -------------- |:-----------------:| ------------------------------------------------|
| module         | `<file-path>`     | Create a new Vue-router module                  |
| route          |  `<file-path>`    | Create a new Vue-router route inside a module   |


##Feature Status
__init__
`seabird init [...options]` - working

__create__
`seabird create vue component <file-path> [...options]` - working

`seabird create vue view <file-path> [...options]` - working

`seabird create vuex module <file-path> [...options]` - in progress

`seabird create vuex action  <file-path> [...options]` - pending

`seabird create vue-router module <file-path> [...options]` - pending

`seabird create vue-router action <file-path> [...options]` - pending

`seabird create router module <file-path> [...options]` - pending

`seabird create router module <file-path> [...options]` - pending

`seabird create custom <template-name> <file-path>` - pending

__config__
`seabird config generate` - working

__eject__
`seabird eject templates` - pending
