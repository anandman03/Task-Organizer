'use strict';

const bookMark = require("./schema/book");
const clipboardy = require("clipboardy");
const validator = require("./validator");
const messages = require("./messages");
const storage = require("./storage");

const addBookMark = async (item) => {
    let Link = new String();
    let Name = new String();

    validator.emptyBookMark(item);
    Link = item[0];
    for(let i = 1 ; i < item.length ; i++) {
        Name += String(item[i]);
    }
    const newBookMark = new bookMark(Name, Link);
    storage.addMark(newBookMark);
};

const getBookMark = async (item) => {
    const list = await storage.getMarkList();
    validator.emptyMarkList(list);
    validator.emptyObject(item);

    let Link = '';
    for(const mark of list) {
        if(mark.name == String(item[0])) {
            Link = mark.link;
        }
    }
    validator.emptyObject(Link);
    clipboardy.writeSync(Link);
    messages.copiedItem();
};

const removeBookMark = async (item) => {
    const list = await storage.getMarkList();
    validator.emptyMarkList(list);
    validator.emptyObject(item);

    let Name = item.join(' ');
    let index = -1;
    for(let i = 0 ; i < list.length ; i++) {
        if(list[i].name == String(Name)) {
            index = i;
            break;
        }
    }
    if(index == -1) {
        messages.linkNotFound();
        process.exit();
    }
    await storage.deleteMark(index);
};

const viewBookMark = async () => {
    const list = await storage.getMarkList();
    validator.emptyMarkList(list);
    console.log('\n');
    for(const item of list) {
        messages.linkDisplay(item);
    }
};

module.exports = {
    addBookMark,
    viewBookMark,
    getBookMark,
    removeBookMark
}