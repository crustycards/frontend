module.exports.createModels = (model, array) => {
  let promises = [];
  array.forEach((item) => {
    promises.push(
      model.create(item)
    );
  });
  return Promise.all(promises);
};