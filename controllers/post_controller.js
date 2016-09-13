const posts = require('../models/posts');
const categories = require('../models/categories');

exports.createPostWithCategories = (postTitle, categoryTitles) => {
    let persistedCategories;
    let persistedPost;
    return categories.getCategoriesByTitleList(categoryTitles)
        .then(existingCategories => {
            persistedCategories = existingCategories;
            const unpersistedCategories = categoryTitles.filter(category => persistedCategories.map(p => p.title).indexOf(category) === -1);
            return Promise.all(unpersistedCategories.map(category => {
                return categories.createCategory(category);
            }));
        }).then(([newCategories]) => {
            persistedCategories = persistedCategories.concat(newCategories);
            return posts.createPost(postTitle);
        }).then(([newPost]) => {
            persistedPost = newPost;
            return Promise.all(persistedCategories.map(category => {
                return posts.attachPostCategory(persistedPost.id, category.id);
            }));
        }).then(results => {
            return posts.getPostCategoriesById(persistedPost.id);
        });
};