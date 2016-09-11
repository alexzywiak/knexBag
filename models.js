const { db, createTrxFunc, TABLES } = require('./db');

// create category
exports.createCategory = (title, existingTransaction) => {
    return db.insert({ title }).into(TABLES.CATEGORIES).returning('*');
};

// create post
exports.createPost = (title, existingTransaction) => {
    return db.insert({ title }).into(TABLES.POSTS).returning('*');
};

// attach category to post
exports.attachPostCategory = (postId, categoryId, existingTransaction) => {
    return db.insert({ post_id: postId, category_id: categoryId }).into(TABLES.CATEGORIES_POSTS).returning('*');
};

// query post with categories
exports.getPostById = id => {
    return db.select(`${TABLES.POSTS}.*`, `${TABLES.CATEGORIES}.title as category_title`)
        .from(TABLES.POSTS)
        .leftJoin(TABLES.CATEGORIES_POSTS, `${TABLES.CATEGORIES_POSTS}.post_id`, `${TABLES.POSTS}.id`)
        .leftJoin(TABLES.CATEGORIES, `${TABLES.CATEGORIES_POSTS}.category_id`, `${TABLES.CATEGORIES}.id`)
        .where(`${TABLES.POSTS}.id`, id)
        .then(results => {
            return results.reduce((memo, categoryEntry) => {
                if (!memo.title){
                    memo.title = categoryEntry.title;
                }
                if (!memo.categories) {
                    memo.categories = [];
                }
                memo.categories.push(categoryEntry.category_title);
                return memo;
            }, {});
        });
};

exports.createPostWithCategories = (postTitle, categoryTitles) => {
    let persistedCategories;
    let persistedPost;
    return db.select('*')
        .from(TABLES.CATEGORIES)
        .whereIn('title', categoryTitles)
        .then(existingCategories => {
            persistedCategories = existingCategories;
            const unpersistedCategories = categoryTitles.filter(category => persistedCategories.map(p => p.title).indexOf(category) === -1);
            return Promise.all(unpersistedCategories.map(category => {
                return exports.createCategory(category);
            }));
        }).then(([newCategories]) => {
            persistedCategories = persistedCategories.concat(newCategories);
            return exports.createPost(postTitle);
        }).then(([newPost]) => {
            persistedPost = newPost;
            return Promise.all(persistedCategories.map(category => {
                return exports.attachPostCategory(persistedPost.id, category.id);
            }));
        }).then(results => {
            return exports.getPostById(persistedPost.id);
        });
};