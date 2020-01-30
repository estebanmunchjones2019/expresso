const express = require('express');
const sqlite3 = require('sqlite3');

const timesheetsRouter = express.Router( { mergeParams: true } );
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

timesheetsRouter.get('/',(req, res, next)=>{
    db.all(`SELECT * FROM Timesheet WHERE employee_id = ${req.params.employeeId}`, (err, timesheets)=>{
        if(err){
            return next(err);
        }
        res.status(200).json( { timesheets: timesheets } );
    })
});

timesheetsRouter.post('/', (req, res, next)=>{
    const hours = req.body.timesheet.hours;
    const rate = req.body.timesheet.rate;
    const date = req.body.timesheet.date;
    if(!hours || !rate || !date){
        return res.sendStatus(400);
    }
    
    const sql = `INSERT INTO Timesheet (
        hours,
        rate,
        date,
        employee_id)
        VALUES (
        $hours,
        $rate,
        $date,
        $employeeId)`;
    const values = {
        $hours: hours,
        $rate: rate,
        $date: date,
        $employeeId: req.params.employeeId
    };

    db.run(sql, values, function(err){
        if(err){
            return next(err);
        }
        db.get(`SELECT * FROM Timesheet WHERE id = ${this.lastID}`, (err,timesheet)=>{
            if(err){
                return next(err);
            }
            res.status(201).json( { timesheet: timesheet} );
        })
    })
});

module.exports = timesheetsRouter;