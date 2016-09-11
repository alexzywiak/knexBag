const { assert } = require('chai');
const { db, TABLES } = require('../db');
const models = require('../models');
const controller = require('../controller');

const categoryTitle = 'new category';
const postTitle = 'new post';

describe('db controller', () => {
    let postId;
    let categoryId;

    beforeEach(() => {
        return models.createCategory(categoryTitle)
            .then(([category]) => {
                categoryId = category.id;
                return models.createPost(postTitle);
            }).then(([post]) => postId = post.id);
    });

    afterEach(() => {
        return db(TABLES.CATEGORIES_POSTS).del()
            .then(() => db(TABLES.CATEGORIES).del())
            .then(() => db(TABLES.POSTS).del());
    });

    it('creates a post associated with a list of categories', () => {
        const newPostTitle = 'second post';
        const newCategoryTitle = 'second category';
        const categories = [categoryTitle, newCategoryTitle];

        return controller.createPostWithCategories(newPostTitle, categories)
            .then((result) => {
                assert.equal(result.title, newPostTitle);
                assert.deepEqual(result.categories, categories);
                return db.select('*').from(TABLES.CATEGORIES).where('title', categoryTitle);
            }).then(results => {
                assert.equal(results.length, 1);
            });
    });
});