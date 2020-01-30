const express = require('express');
const sqlite3 = require('sqlite3');
const timesheetsRouter = require('./timesheets');


const employeesRouter = express.Router();
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


employeesRouter.param('employeeId', (req, res, next, employeeId)=>{
    db.get(`SELECT * FROM Employee WHERE id = ${employeeId}`, (err, employee)=>{
        if(err){
            return next(err);
        }
        if(!employee){
            return res.sendStatus(404);
        }
        req.employee = employee;
        next();
    })
});

employeesRouter.use('/:employeeId/timesheets', timesheetsRouter);

employeesRouter.get('/', (req, res, next)=>{
    db.all(`SELECT * FROM Employee WHERE is_current_employee = 1`, (err, employees)=>{
        if(err){
            return next(err);
        }
        res.status(200).json( { employees: employees } );
    })
});

employeesRouter.post('/', (req, res, next)=>{
    const name = req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;
    const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;
    
    if(!name || !position || !wage){
        return res.sendStatus(400);
    }
    
    const sql = `INSERT INTO Employee (
        name,
        position,
        wage,
        is_current_employee)
        VALUES (
        $name,
        $position,
        $wage,
        $isCurrentEmployee
    )`;
    const values = {
        $name: name,
        $position: position,
        $wage: wage,
        $isCurrentEmployee: isCurrentEmployee
    };
    db.run(sql, values, function(err){
        if(err){
            return next();
        }
        db.get(`SELECT * FROM Employee WHERE id = ${this.lastID}`, (err, employee)=>{
            if(err){
                return next();
            }
            res.status(201).json( { employee: employee } );
        })
    })
});

employeesRouter.get('/:employeeId', (req, res, next)=>{
    res.status(200).json( { employee: req.employee });
});

employeesRouter.put('/:employeeId', (req, res, next)=>{
    const name = req.body.employee.name;
    const position = req.body.employee.position;
    const wage = req.body.employee.wage;
    const isCurrentEmployee = req.body.employee.isCurrentEmployee === 0 ? 0 : 1;

    if(!name || !position || !wage){
        return res.sendStatus(400);
    }

    const sql = `UPDATE Employee SET
        name = $name,
        position = $position,
        wage = $wage,
        is_current_employee = $isCurrentEmployee
        WHERE id = $id`;
    const values = {
        $name: name,
        $position: position,
        $wage: wage,
        $isCurrentEmployee: isCurrentEmployee,
        $id: req.params.employeeId
    };
    db.run(sql, values, (err)=>{
        if(err){
            return next(err);
        }
        db.get(`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`, (err,employee)=>{
            if(err){
                return next(err);
            }
            res.status(200).json( { employee: employee} );
        })
    })
});

employeesRouter.delete('/:employeeId', (req, res, next)=>{
    const sql = `UPDATE Employee SET
    is_current_employee = 0
    WHERE id = $id`;
    const value = {
        $id : req.params.employeeId
    };
    db.run(sql, value, (err)=>{
        if(err){
            return next(err);
        }
        db.get(`SELECT * FROM Employee WHERE id = ${req.params.employeeId}`, (err, employee)=>{
            if(err){
                return next(err);
            }
            res.status(200).json( { employee: employee } );
        })
    })
});

module.exports = employeesRouter;