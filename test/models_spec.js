const { assert } = require('chai');
const { db, TABLES } = require('../db');
const models = require('../models');

const categoryTitle = 'new category';
const postTitle = 'new post';

describe('db models', () => {

    afterEach(() => {
        return db(TABLES.CATEGORIES_POSTS).del()
            .then(() => db(TABLES.CATEGORIES).del())
            .then(() => db(TABLES.POSTS).del());
    });

    it('creates a new post', () => {
        return models.createPost(postTitle)
            .then(([result]) => {
                assert.equal(result.title, postTitle);
                return db.select('*').from(TABLES.POSTS);
            }).then(([result]) => {
                assert.equal(result.title, postTitle);
            });
    });

    it('creates a new category', () => {
        return models.createCategory(categoryTitle)
            .then(([result]) => {
                assert.equal(result.title, categoryTitle);
                return db.select('*').from(TABLES.CATEGORIES);
            }).then(([result]) => {
                assert.equal(result.title, categoryTitle);
            });
    });

    describe('posts and categories', () => {
        let postId;
        let categoryId;
        
        beforeEach(() => {
            return models.createCategory(categoryTitle)
                .then(([category]) => {
                    categoryId = category.id;
                    return models.createPost(postTitle);
                }).then(([post]) => postId = post.id);
        });

        it('attaches a post and a category', () => {
            return models.attachPostCategory(postId, categoryId)
                .then(() => {
                    return db.select('*').from(TABLES.CATEGORIES_POSTS).where({
                        post_id: postId,
                        category_id: categoryId
                    });
                }).then(result => assert.equal(result.length, 1));
        });

        it('gets a post with all associated categories', () => {
            return models.attachPostCategory(postId, categoryId)
                .then(() => models.getPostCategoriesById(postId))
                .then((result) => {
                    assert.equal(result.title, postTitle);
                    assert.deepEqual(result.categories, [categoryTitle]);
                });
        });
    });
});