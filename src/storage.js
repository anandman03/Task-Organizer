'use strict';

const fs = require("fs");
const messages = require("./messages");
const pathConfig = require("./helpers/pathConfig");


class Storage {

    storeItem = async (task) => {
        if(!this.FileExist()) {
            await this.saveItemInFile([task], task, -1, "C");
        }
        else {
            const list = await this.getTaskList();
            list.push(task);
            await this.saveItemInFile(list, task, -1, "C");
        }
    }
    
    deleteItem = async (index) => {
        let list = await this.getTaskList();
        list.splice(index, 1);
        for(let i = index ; i < list.length ; i++) {
            list[i]._id -= 1;
        }
        await this.saveItemInFile(list, {}, index+1, "D");
    }
    
    updateCompleteStatus = async (index) => {
        let list = await this.getTaskList();
        list[index]._isComplete = !list[index]._isComplete;
        await this.saveItemInFile(list, {}, index+1, "U");
    }
    
    updatePriority = async (index, p) => {
        let list = await this.getTaskList();
        list[index]._priority = p;
        await this.saveItemInFile(list, {}, index+1, "U");
    }
    
    updateBoard = async (currName, newName) => {
        let list = await this.getTaskList();
        for(const task of list) {
            if(task._board === currName) {
                task._board = newName;
            }
        }
        await this.saveItemInFile(list, {}, -1, "UB");
    }
    
    updateTask = async (ID, desc) => {
        let list = await this.getTaskList();
        list[ID]._description = desc;
        await this.saveItemInFile(list, {}, ID+1, "U");
    }
    
    updateTaskBoard = async (ID, boardName) => {
        let list = await this.getTaskList();
        list[ID]._board = boardName;
        await this.saveItemInFile(list, {}, ID+1, "U");
    }
    
    updateStarItem = async (ID) => {
        let list = await this.getTaskList();
        list[ID]._isStarred = !list[ID]._isStarred;
        await this.saveItemInFile(list, {}, ID+1, "U");
    }
    
    updateList = async (list) => {
        await this.saveItemInFile(list, {}, -1, "UB");
    }
    
    updateProgress = async (ID) => {
        let list = await this.getTaskList();
        list[ID]._inProgress = !list[ID]._inProgress;
        await this.saveItemInFile(list, {}, ID+1, "U");
    }
    
    removeAll = async() => {
        await this.saveItemInFile([], {}, -1, "UB");
    }
    
    saveItemInFile = async (task, ob, index, type) => {
        fs.writeFile(pathConfig.filePath, JSON.stringify(task), err => {
            if(err) throw err;
            if(type === "C") {
                messages.creation(ob);
            }
            if(type === "D") {
                messages.deletion(index);
            }
            if(type === "U") {
                messages.updation(index);
            }
            if(type === "UB") {
                messages.listUpdation();
            }
        });
    }
    
    getTaskList = async () => {
        if(this.FileExist()) {
            return require(pathConfig.filePath);
        }
        return [];
    }
    
    FileExist = () => {
         return fs.existsSync(pathConfig.filePath);
    }
    
    addMark = async (marker) => {
        if(!fs.existsSync(pathConfig.markerPath)) {
            await this.saveMarker([marker], "C");
        }
        else {
            const list = await require(pathConfig.markerPath);
            list.push(marker);
            await this.saveMarker(list, "C");
        }
    }
    
    deleteMark = async (index) => {
        let list = await require(pathConfig.markerPath);
        list.splice(index, 1);
        await this.saveMarker(list, "D");
    }
    
    getMarkList = async () => {
        if(fs.existsSync(pathConfig.markerPath)) {
            return require(pathConfig.markerPath);
        }
        return [];
    }
    
    saveMarker = async (list, type) => {
        fs.writeFile(pathConfig.markerPath, JSON.stringify(list), err => {
            if(err) throw err;
            if(type == "C") {
                messages.linkAdded();
            }
            if(type == "D") {
                messages.linkRemoved();
            }
        });
    }
};

module.exports = new Storage();