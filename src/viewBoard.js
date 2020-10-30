'use strict';

const storage = require("./storage");
const messages = require("./messages");
const validator = require("./validator");
const getDate = require("./helpers/getDate");


class viewBoard {

    constructor() {
        this.done = 0;
        this.notes = 0;
        this.pending = 0;
        this.inProcess = 0;
    }

    // initialise = () => {
    //     this.done = this.pending = this.notes = this.inProcess = 0;
    // }
    
    calculate = () => {
        let percentCompletion = Math.floor(100*(this.done/(this.done + this.pending)));
        messages.taskCompleteData(percentCompletion);
        messages.overView(this.done, this.pending, this.inProcess, this.notes);
        messages.newLine();
    }
    
    findItem = async (item) => {
        const value = item.join(' ').trim();
        if(Number.isInteger(parseInt(value))) {
            await this.viewTask(Number(value));
        }
        else {
            await this.viewBoard(String(value));
        }
    }
    
    viewTimeline = async () => {
        let list = await storage.getTaskList();
        validator.emptyContainer(list);
        // initialise();
    
        const dates = new Set();
        for(let task of list) {
            task._date = await getDate.structureDate(task._date);
            dates.add(task._date);
        }
        let uniqueDates = [];
        for(const date of dates) {
            uniqueDates.push(date);
        }
        uniqueDates.sort((d1, d2) => {
            let m1 = getDate.monthValue(d1.substring(4, 7));
            let m2 = getDate.monthValue(d2.substring(4, 7));
            if(parseInt(m1) == parseInt(m2)) {
                let day1 = Number(d1.substring(8, 10));
                let day2 = Number(d2.substring(8, 10));
                return day1 - day2;
            }
            return m1 - m2;
        });
    
        for(let date of uniqueDates)
        {
            messages.boardTitle(date);
            for(const item of list)
            {
                if(date === item._date) 
                {
                    const task = await this.makeObject(item);
                    messages.viewTask(task, item._type);
                    
                    if(item._inProgress === true) {
                        this.inProcess += 1;
                    }
                    if(item._type === "NOTE") {
                        this.notes += 1;
                    }
                    else if(item._isComplete === true) {
                        this.done += 1;
                    }
                    else {
                        this.pending += 1;
                    }
                }
            }
        }
        this.calculate();
    }
    
    displayItems = async () => {
        const list = await storage.getTaskList();
        validator.emptyContainer(list);
        // initialise();
    
        const dashBoards = new Set();
        for(const task of list) {
            dashBoards.add(task._board);
        }
        for(const board of dashBoards) 
        {
            messages.boardTitle(board);
            for(const item of list) 
            {
                if(board === item._board) 
                {
                    const task = await this.makeObject(item);
                    messages.viewTask(task, item._type);
    
                    if(item._inProgress === true) {
                        this.inProcess += 1;
                    }
                    if(item._type === "NOTE") {
                        this.notes += 1;
                    }
                    else if(item._isComplete === true) {
                        this.done += 1;
                    }
                    else {
                        this.pending += 1;
                    }
                }
            }
        }
        this.calculate();
    }
    
    listItems = async (item) => {
        let str = String(item.join()).trim();
        if(str === "done") {
            await this.doneTask();
        }
        if(str === "pending") {
            await this.pendingTask();
        }
        if(str === "in-progress") {
            await this.inProgressTask();
        }
        if(str === "notes") {
            await this.getNotes();
        }
    }
    
    doneTask = async () => {
        const list = await storage.getTaskList();
        // initialise();
    
        for(const item of list) {
            if(item._isComplete === true) {
                const task = await makeObject(item);
                messages.viewTask(task, item._type);
                this.done += 1;
            }
            else {
                this.pending += 1;
            }
            if(item._inProgress === true) {
                this.inProcess += 1;
            }
            if(item._type === "NOTE") {
                this.notes += 1;
            }
        }
        if(done === 0) {
            messages.notFound();
        }
        this.calculate();
    }
    
    pendingTask = async () => {
        const list = await storage.getTaskList();
        // initialise();
        messages.newLine();
    
        for(const item of list) {
            if(item._isComplete !== true) {
                const task = await this.makeObject(item);
                messages.viewTask(task, item._type);
                this.pending += 1;
            }
            else {
                this.done += 1;
            }
            if(item._inProgress === true) {
                this.inProcess += 1;
            }
            if(item._type === "NOTE") {
                this.notes += 1;
            }
        }
        if(this.pending === 0) {
            messages.notFound();
        }
        this.calculate();
    }
    
    inProgressTask = async () => {
        const list = await storage.getTaskList();
        // initialise();
    
        for(const item of list) {
            if(item._isComplete !== true) {
                this.pending += 1;
            }
            else {
                this.done += 1;
            }
            if(item._inProgress === true) {
                const task = await this.makeObject(item);
                messages.viewTask(task, item._type);
                this.inProcess += 1;
            }
            if(item._type === "NOTE") {
                this.notes += 1;
            }
        }
        if(this.inProcess === 0) {
            messages.notFound();
        }
        this.calculate();
    }
    
    getNotes = async () => {
        const list = await storage.getTaskList();
        // initialise();
    
        for(const item of list) {
            if(item._isComplete !== true) {
                this.pending += 1;
            }
            else {
                this.done += 1;
            }
            if(item._inProgress === true) {
                this.inProcess += 1;
            }
            if(item._type === "NOTE") {
                const task = await this.makeObject(item);
                messages.viewTask(task, item._type);
                this.notes += 1;
            }
        }
        if(this.notes === 0) {
            messages.notFound();
        }
        this.calculate();
    }
    
    viewTask = async (value) => {
        const list = await storage.getTaskList();
        // initialise();
    
        validator.validID(value, list);
        messages.newLine();
    
        for(const item of list) {
            if(value == item._id) {
                const task = await this.makeObject(item);
                messages.viewTask(task, item._type);
            }
            if(item._inProgress === true) {
                this.inProcess += 1;
            }
            if(item._type === "NOTE") {
                this.notes += 1;
            }
            else if(item._isComplete === true) {
                this.done += 1;
            }
            else {
                this.pending += 1;
            }
        }
        this.calculate();
    }
    
    viewBoard = async (value) => {
        const list = await storage.getTaskList();
        // initialise();
    
        let found = false;
        for(const item of list) {
            if(item._board == value) {
                found = true;
            }
        }
        if(found === false) {
            messages.boardNotFound();
            process.exit();
        }
    
        messages.boardTitle(value);
        for(const item of list) {
            if(value == item._board) {
                const task = await this.makeObject(item);
                messages.viewTask(task, item._type);
            }
            if(item._inProgress === true) {
                this.inProcess += 1;
            }
            if(item._type === "NOTE") {
                this.notes += 1;
            }
            else if(item._isComplete === true) {
                this.done += 1;
            }
            else {
                this.pending += 1;
            }
        }
        this.calculate();
    }
    
    makeObject = async (item) => {
        const task = {
            id: item._id,
            desc: item._description,
            days: getDate.calculateDays(item._date),
            star: Boolean(item._isStarred),
            done: Boolean(item._isComplete) || false,
            priority: Number(item._priority),
            inProgress: Boolean(item._inProgress),
        };
        return task;
    }
};


module.exports = new viewBoard();