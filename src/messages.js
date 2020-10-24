#!/usr/bin/env node
'use strict';

const chalk = require("chalk");
const boxen = require("boxen");
const signale = require("signale");

const boxOptions = {
    margin: 0,
    padding: 0,
    float: "left",
    align: "center",
    dimBorder: false,
    borderStyle: "bold",
    borderColor: "white",
};

signale.config({
    displayLabel: false,
});

const newLine = () => {
    console.log('\n');
}

const creation = (task) => {
    signale.debug({
        prefix: '\n', 
        message: chalk.whiteBright(`Created ${String(task._type).toLocaleLowerCase()}: ${task._id}`), 
        suffix: '\n'
    });
};

const deletion = (ID) => {
    signale.debug({
        prefix: '\n', 
        message: chalk.whiteBright(`Removed item: ${ID}`), 
        suffix: '\n'
    });
};

const updation = (ID) => {
    signale.debug({
        prefix: '\n', 
        message: chalk.whiteBright(`Updated item: ${ID}`), 
        suffix: '\n'
    });
};

const listUpdation = () => {
    signale.debug({
        prefix: '\n', 
        message: chalk.whiteBright(`TaskList Updated`), 
        suffix: '\n'
    });
};

const invalid = () => {
    signale.error({
        prefix: '\n', 
        message: chalk.redBright('Invalid Input'), 
        suffix: '\n'
    });
};

const notesUpdation = () => {
    signale.error({
        prefix: '\n', 
        message: chalk.redBright('Cannot update notes.'), 
        suffix: '\n'
    });
};

const copiedItem = () => {
    signale.debug({
        prefix: '\n', 
        message: chalk.whiteBright(`Item copied`), 
        suffix: '\n'
    });
};

const boardTitle = (name) => {
    console.log('\n');
    console.log(boxen(chalk.rgb(255,0,255)(`${name}`), boxOptions));
};

const taskEmpty = () => {
    newLine();
    signale.error(chalk.whiteBright('Type `tl --help` to get started!'));
    taskCompleteData(0);
    overView(0, 0, 0, 0);
    newLine();
};

const taskNotFound = (ID) => {
    signale.error({
        prefix: '\n', 
        message: chalk.whiteBright(`Unable to find item with id: ${ID}`), 
        suffix: '\n'
    });
};

const boardNotFound = (ID) => {
    signale.error({
        prefix: '\n', 
        message: chalk.whiteBright(`Unable to find board`), 
        suffix: '\n'
    });
};

const notFound = () => {
    signale.debug({
        prefix: '\n', 
        message: chalk.whiteBright(`No task found.`), 
        suffix: '\n'
    });
};

const taskCompleteData = (percent) => {
    signale.fav({
        prefix: '\n', 
        message: chalk.gray(`${percent}% of the tasks complete.`)
    });
};

const multiFlags = () => {
    signale.error({
        prefix: '\n', 
        message: chalk.whiteBright(`Concurrent operation not allowed.`), 
        suffix: '\n'
    });
};

const overView = (done, pending, inProcess, notes) => {
    const Done = chalk.green(`${done}`);
    const Pending = chalk.magenta(`${pending}`);
    const InProcess = chalk.green(`${inProcess}`);
    const Notes = chalk.blue(`${notes}`);
    const message = chalk.gray(`${Done} done  |  ${Pending} pending  |  ${InProcess} in-progress  |  ${Notes} notes`);
    console.log(message);
};

const viewTask = (item, type) =>  {
    if(type === "NOTE") {
        signale.note({
            prefix: chalk.whiteBright(`${item.id}.`), 
            message: chalk.whiteBright(`${item.desc}`), 
            suffix: chalk.gray(`(${item.days}d)`) + ((item.star === true) ? '⭐' : ''),
        });
    }
    else if(type === "TASK") {
        if(item.done === true) {
            signale.success({
                prefix: chalk.gray(`${item.id}.`), 
                message: chalk.gray(`${item.desc}`), 
                suffix: chalk.gray(`(${item.days}d)`) + ((item.star === true) ? '⭐' : ''),
            });
        }
        else if(item.inProgress === true) {
            signale.start({
                prefix: chalk.whiteBright.underline(`${item.id}.`), 
                message: chalk.whiteBright.underline(`${item.desc}`), 
                suffix: chalk.gray(`(${item.days}d)`) + ((item.star === true) ? '⭐' : ''),
            });
        }
        else {
            if(item.priority == 3) {
                signale.pending({
                    prefix: chalk.whiteBright(`${item.id}.`), 
                    message: chalk.whiteBright(`${item.desc}`), 
                    suffix: chalk.gray(`(${item.days}d)`) + ((item.star === true) ? '⭐' : ''),
                });
            }
            if(item.priority == 2) {
                signale.pending({
                    prefix: chalk.yellowBright(`${item.id}.`), 
                    message: chalk.yellowBright(`${item.desc}`), 
                    suffix: chalk.gray(`(${item.days}d)`) + ((item.star === true) ? '⭐' : ''),
                });
            }
            if(item.priority == 1) {
                signale.pending({
                    prefix: chalk.redBright(`${item.id}.`), 
                    message: chalk.redBright(`${item.desc}`), 
                    suffix: chalk.gray(`(${item.days}d)`) + ((item.star === true) ? '⭐' : ''),
                });
            }
        }
    }
};

module.exports = {
    newLine,
    invalid,
    creation,
    deletion,
    viewTask,
    updation,
    overView,
    notFound,
    taskEmpty,
    boardTitle,
    multiFlags,
    copiedItem,
    taskNotFound,
    listUpdation,
    notesUpdation,
    boardNotFound,
    taskCompleteData
};