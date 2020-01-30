const express = require('express');
const sqlite3 = require('sqlite3');
const menuItemsRouter = require('./menuItems');

const menusRouter = express.Router( { mergeParams: true } );
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menusRouter.param('menuId', (req, res, next, menuId)=>{
    console.log('got into params');
    db.get(`SELECT * FROM Menu WHERE id = ${menuId}`, (err, menu)=>{
        if(err){
            return next(err);
        }
        if(!menu){
            return res.sendStatus(404);
        }
        req.menu = menu;
        next();
    })
});

menusRouter.use('/:menuId/menu-items', menuItemsRouter);

menusRouter.get('/', (req, res, next)=>{
    db.all(`SELECT * FROM Menu`, (err, menus)=>{
        if(err){
            return next(err);
        }
        res.status(200).json( { menus: menus} );
    })
});

menusRouter.post('/', (req, res, next)=>{
    const title = req.body.menu.title;
    if(!title){
        return res.sendStatus(400);
    }
    const sql = `INSERT INTO Menu (
        title) VALUES (
        $title)`;
    const value = {
        $title: title
    };

    db.run(sql, value, function(err){
        if(err){
            return next(err);
        }
        db.get(`SELECT * FROM Menu WHERE id = ${this.lastID}`, (err,menu)=>{
            if(err){
                return next(err);
            }
            res.status(201).json( { menu: menu} );
        })
    })
});

menusRouter.get('/:menuId', (req, res, next)=>{
    res.status(200).json( { menu: req.menu } );
});

menusRouter.put('/:menuId', (req, res, next)=>{
    const title = req.body.menu.title;
    if(!title){
        return res.sendStatus(400);
    };
    
    const sql = `UPDATE Menu SET title = $title WHERE id = $id `;
    const values = {
        $title: title,
        $id: req.params.menuId
    };
    db.run(sql, values, (err)=>{
        if(err){
            return next(err);
        }
        db.get(`SELECT * FROM Menu WHERE id = ${req.params.menuId}`, (err, menu)=>{
            if(err){
                return next(err);
            }
            res.status(200).json( { menu: menu } );
        })
    })
});

menusRouter.delete('/:menuId', (req, res, next)=>{
    db.get(`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`, (err, menuItem)=>{
        if(err){
            return next(err);
        }
        if(menuItem){
            return res.sendStatus(400);
        }
        const sql = `DELETE FROM Menu WHERE id = $id`;
        const value = {
            $id: req.params.menuId
        };
        db.run(sql, value, (err)=>{
            if(err){
                return next(err);
            }
            res.sendStatus(204);
        })
    })
});



module.exports = menusRouter;