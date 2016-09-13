const { db, TABLES } = require('../db');

// create category
exports.createCategory = title => {
    return db.insert({ title }).into(TABLES.CATEGORIES).returning('*');
};

exports.getCategoriesByTitleList = titleList => {
    return db.select('*').from(TABLES.CATEGORIES).whereIn('title', titleList);
}