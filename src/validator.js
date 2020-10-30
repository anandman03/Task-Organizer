'use strict';

const messages = require("./messages");

class Validator {

    validpriority = (p) => {
        const priority = parseInt(p.substring(2));
        return (priority >= 1 && priority <= 3 && p[0] === 'p');
    }

    validString = (s) => {
        return !Number.isInteger(parseInt(s));
    }

    validInt = async (num) => {
        if(!Number.isInteger(parseInt(num))) {
            messages.invalid();
            process.exit();
        }
    }

    emptyObject = (ob) => {
        if(Object.keys(ob).length === 0) {
            messages.invalid();
            process.exit();
        }
    }

    emptyContainer = (list) => {
        if(list.length === 0) {
            messages.taskEmpty();
            process.exit();
        }
    }

    emptyMarkList = (list) => {
        if(list.length === 0) {
            messages.linkNotFound();
            process.exit();
        }
    }
    
    validID = (index, list) => {
        if(index > list.length) {
            messages.taskNotFound(index);
            process.exit();
        }
    };
    
    emptyBookMark = (item) => {
        if(parseInt(item.length) < 2) {
            messages.invalid();
            process.exit();
        }
    };
};


module.exports = new Validator();