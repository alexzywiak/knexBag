const models = require('./models');

exports.createPostWithCategories = (postTitle, categoryTitles) => {
    let persistedCategories;
    let persistedPost;
    return models.getCategoriesByTitleList(categoryTitles)
        .then(existingCategories => {
            persistedCategories = existingCategories;
            const unpersistedCategories = categoryTitles.filter(category => persistedCategories.map(p => p.title).indexOf(category) === -1);
            return Promise.all(unpersistedCategories.map(category => {
                return models.createCategory(category);
            }));
        }).then(([newCategories]) => {
            persistedCategories = persistedCategories.concat(newCategories);
            return models.createPost(postTitle);
        }).then(([newPost]) => {
            persistedPost = newPost;
            return Promise.all(persistedCategories.map(category => {
                return models.attachPostCategory(persistedPost.id, category.id);
            }));
        }).then(results => {
            return models.getPostCategoriesById(persistedPost.id);
        });
};