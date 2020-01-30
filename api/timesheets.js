const express = require('express');
const sqlite3 = require('sqlite3');

const timesheetsRouter = express.Router( { mergeParams: true } );
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

timesheetsRouter.param('timesheetId', (req, res, next, timesheetId)=>{
    db.get(`SELECT * FROM Timesheet WHERE id = ${timesheetId}`, (err, timesheet)=>{
        if(err){
            return next(err);
        }
        if(!timesheet){
            return res.sendStatus(404);
        }
        req.timesheet = timesheet;
        next();
    })
});

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

timesheetsRouter.put('/:timesheetId', (req, res, next)=>{
    const hours = req.body.timesheet.hours;
    const rate = req.body.timesheet.rate;
    const date = req.body.timesheet.date;
    if(!hours || !rate || !date){
        return res.sendStatus(400);
    }

    const sql = `UPDATE Timesheet SET 
        hours = $hours,
        rate = $rate,
        date = $date,
        employee_id =  $employeeId
        WHERE id = $id`;
    const values = {
        $hours: hours,
        $rate: rate,
        $date: date,
        $employeeId: req.params.employeeId,
        $id: req.params.timesheetId
    };

    db.run(sql, values, (err)=>{
        if(err){
            return next(err);
        }
        db.get(`SELECT * FROM Timesheet WHERE id = ${req.params.timesheetId}`, (err, timesheet)=>{
            if(err){
                return next(err);
            }
            res.status(200).json( { timesheet: timesheet } );
        })
    })
});

timesheetsRouter.delete('/:timesheetId', (req, res, next)=>{
    const sql = `DELETE FROM Timesheet WHERE id = $id`;
    const value = {
        $id: req.params.timesheetId
    };
    db.run(sql, value, (err)=>{
        if(err){
            return next(err);
        }
        res.sendStatus(204);
    })
});


module.exports = timesheetsRouter;