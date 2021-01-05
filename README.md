
<p  align="center"><img  width=50%  src="https://raw.githubusercontent.com/jasonrhaddix/seabird/master/assets/images/seabird-logo.png"></p>



# Overview

Seabird is a command line tool that adds automation for the Vue ecosystem. Its main functionality is to generate templates using [ejs](https://ejs.co/) with either user supplied or default internal data.

>Currently Seabird can only genterate Vue components and views, however, we are adding Vue-router modules, routes, Vuex modules, and vuex actions very soon.



# Status

__`Alpha`__ This project is currently in alpha phase.

Some features may break between releases, and others may be removed entirely. Look to the __Feature Status__ section below to see which phase a current feature is in.

I am not currently accepting pull requests. However, if you'd like a feature added, please submit an issue in GitHub as a feature request.



# Installation

To use Seabird in any directory be sure to install globally.
```bash
npm i seabird -g
```
>You can use `seabird` or `sea` to call commands



# Usage
Seabird is a command line tool that will either generate files from [ejs](https://ejs.co/) templates or make insertions in files to complete its task. By default, files that are generated from templates use internal `.ejs` files and compile with default options and data parameters. 

By creating a `seabird.config.js` file, you can override the default options, data, or even supply your own `.ejs` template to render. Seabird will use the data object in the config against either the default, or supplied template. However, if you define the data object with reserved JavaScript keywords as keys, the application will halt and the template will not compile. 

__Options Hierarchy__

`command defined > config defined > default`

The above hierarchy allows you to override the default options with your own in the config, but still have the option to override your own settings on a per-command instance.

##### example:
`searbird create vue component <file-path> [...options]`

| Option     | Default | Config | Neagatable Command |
| ---------- |:-------:| ------ | -------------------|
| --vuex-map | false   | true   | --no-vuex-map      |

The above example shows that the default value of `--vuex-map` is `false`, and is not rendered to the template. The user has changed the default value to `true` in the config avoiding having to explicitly set the `--vuex-map` option in the command line. The user now has the ability to use the negatable option `--no-vuex-map` to explicitly set the option to `false` for each command. 

The pattern illustrated above is possible in all commands that use a template when creating a file (`component`, `view` and `module`), however, this is not possible for insertions into existing files (`action` and `route`)



# Commands

Commands are chained to make targeting the correct command easier.

For example, if you want to create a new Vue component you need to call the `create` command, with the `vue` subcommand, targeting the Vue library, and then the `component` subcommand along with the required `<file-path>` to create a Vue component

__Example__

`seabird create vue component <file-path> [...options]`

`seabird create router module <file-path>`

`seabird config generate`

Calling `--help` at any level of the command chain will output a description of the child commands and options.

__Arguments__

Almost all subcommands will have arguments that are either `<required>` or `[optional]`. Seabird will normally try to make assumptions or set defaults when optional arguments are not supplied. If `<required>` arguments are not supplied Seabird will abort the command.

`seabird init [options]`

`seabird create <create-subcommand>`

`seabird config <config-subcommand>`

`seabird --help`

| Command       | Shorthand    | Description                           |
| ------------- |:------------:| --------------------------------------|
| init          | i            | Initializes a new Vue project         |
| create        | c            | Generates ecosystem components        |
| config        |              | Generates or modifies config file     |


## Init | `init`

```bash
seabird init [options]
```

Initializing a new project is done with the `init` command. Seabird will prompt you with an option for initializing a project from a template or from new using the underlying Vue CLI.

##### Init Options

| Option             | Shorthand           | Description                               |
| ------------------ |:-------------------:| ------------------------------------------|
| --template         | t                   | Download a project from a Git repo        |
| --new              | n                   | Create a new project using Vue CLI        |
| --config           | c                   | Creates a config file after app init      |

_To create a new project, Vue CLI will need to be installed on your machine. If Vue CLI is not installed you will be prompted to install it before continuing._


## Create | `create`

```
seabird create <subcommand>
```

The `create` command is used for generating new components, Vuex and Vue Router modules, and new routes or state actions. 

### `create` __Subcommands__

`seabird create vue <vue-subcommand>`

`seabird create vuex <vuex-subcommand>`

`seabird create router <router-subcommand>`

| Command            | Shorthand | Description                                 |
| ------------------ |:---------:| --------------------------------------------|
| vue                |           | Generate Vue library files                  |
| vuex               |           | Generate Vuex library files or actions      |
| router             |           | Generate Vue Router library files or routes |


#### `create vue` Subcommands

`seabird create vue component <file-path> [...options]`

`seabird create vue view <file-path> [...options]`

##### Subcommands

| Command            | Shorthand | Description                                 |
| ------------------ |:---------:| --------------------------------------------|
| component          |           | Generates a Vue component from a template   |
| view               |           | Generates a Vue view from a template        |

##### `component` and `view` Options

| Option             | Default | Description                                              |
| ------------------ |:-------:| ---------------------------------------------------------|
| --vuex-map         | false   | Imports Vuex maps to file [`mapState`, `mapActions` ...] |
| --hooks            | false   | Adds Vue lifecycle hooks to template                     |
| --css-lang         | css     | Sets the style tag lang `lang={css-lang}` to style tag   |
| --scoped-styles    | true    | Adds                                                     |
| --helpers          | true    | Generates a Vue view from a template                     |

Vue `component` and `view` components are created from the same default templates. If you wish to use your own template for either, you need to define the template in you config file.


#### `create vuex` Subcommands

`seabird create vuex module <file-path> [...options]`

`seabird create vuex action <action-path>`

##### Subcommands

| Command            | Shorthand           | Description                                 |
| ------------------ |:-------------------:| --------------------------------------------|
| module             |                     | Generates a Vuex module from a template     |
| action             |                     | Generates a Vuex action in targeted module  |

##### `module`  Options

| Option             | Default | Description                                              |
| ------------------ |:-------:| ---------------------------------------------------------|
| (TDB)              | --      | --                                                       |

##### `action`  Options

| Option             | Default | Description                                              |
| ------------------ |:-------:| ---------------------------------------------------------|
| (TDB)              | --      | --                                                       |



# Feature Status

__Init__

`seabird init [...options]` - working


__Create__

`seabird create vue component <file-path> [...options]` - working

`seabird create vue view <file-path> [...options]` - working

`seabird create vuex module <file-path> [...options]` - in development

`seabird create vuex action <file-path> [...options]` - pending

`seabird create router module <file-path> [...options]` - working

`seabird create router action <file-path> [...options]` - pending

`seabird create custom <template-name> <file-path>` - pending


__Config__

`seabird config generate` - working


__Eject__

`seabird eject templates` - pending
