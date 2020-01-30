const express = require('express');
const sqlite3 = require('sqlite3');

const menuItemsRouter = express.Router( { mergeParams: true } );
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

menuItemsRouter.param('menuItemId', (req, res, next, menuItemId)=>{
    db.get(`SELECT * FROM MenuItem WHERE id = ${menuItemId}`, (err, menuItem)=>{
        if(err){
            return res.sendStatus(400);
        }
        if(!menuItem){
            return res.sendStatus(404);
        }
        req.menuItem = menuItem;
        next();
    })
});

menuItemsRouter.get('/', (req, res, next)=>{
    db.all(`SELECT * FROM MenuItem WHERE menu_id = ${req.params.menuId}`, (err, menuItems)=>{
        if(err){
            return next(err);
        }
       res.status(200).json( { menuItems: menuItems } );
    })
});

menuItemsRouter.post('/', (req, res, next)=>{
    const name = req.body.menuItem.name;
    const description = req.body.menuItem.description;
    const inventory = req.body.menuItem.inventory;
    const price = req.body.menuItem.price;
    if(!name || !inventory || !price){
        return res.sendStatus(400);
    }
    
    const sql = `INSERT INTO MenuItem (
        name,
        description,
        inventory,
        price,
        menu_id)
        VALUES (
        $name,
        $description,
        $inventory,
        $price,
        $menuId)`;
    const values = {
        $name: name,
        $description: description,
        $inventory: inventory,
        $price: price,
        $menuId: req.params.menuId
    };

    db.run(sql, values, function(err){
        if(err){
            return next(err);
        }
        db.get(`SELECT * FROM MenuItem WHERE id = ${this.lastID}`, (err, menuItem)=>{
            if(err){
                return next(err);
            }
            res.status(201).json( { menuItem: menuItem} );
        })
    })
});

menuItemsRouter.put('/:menuItemId', (req, res, next)=>{
    const name = req.body.menuItem.name;
    const description = req.body.menuItem.description;
    const inventory = req.body.menuItem.inventory;
    const price = req.body.menuItem.price;
    if(!name || !inventory || !price){
        return res.sendStatus(400);
    };

    const sql = `UPDATE MenuItem SET
        name = $name,
        description = $description,
        inventory = $inventory,
        price = $price,
        menu_id = $menuId
        WHERE id = $menuItemId`;
    const values = {
        $name: name,
        $description: description,
        $inventory: inventory,
        $price: price,
        $menuId: req.params.menuId,
        $menuItemId: req.params.menuItemId
    };
    
    db.run(sql, values, (err)=>{
        if(err){
            return next(err);
        }
        db.get(`SELECT * FROM MenuItem WHERE id = ${req.params.menuItemId}`, (err, menuItem)=>{
            if(err){
                return next(err);
            }
            res.status(200).json( { menuItem: menuItem} );
        })
    })
});

menuItemsRouter.delete('/:menuItemId', (req, res, next)=>{
    const sql = `DELETE FROM MenuItem WHERE id = $id`;
    const value = {
        $id: req.params.menuItemId
    };
    
    db.run(sql, value, (err)=>{
        if(err){
            return next(err);
        }
        res.sendStatus(204);
    }
    )
});


module.exports = menuItemsRouter;