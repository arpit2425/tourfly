class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }
  filter() {
    const queryObject = { ...this.queryStr };
    const exclude = ['page', 'sort', 'limit', 'fields'];
    exclude.forEach(ele => delete queryObject[ele]);
    let queryString = JSON.stringify(queryObject);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, el => `$${el}`);
    this.query.find(JSON.parse(queryString));
    return this;
  }
  sort() {
    if (this.queryStr.sort) {
      const sortStr = this.queryStr.sort.split(',').join(' ');

      this.query = this.query.sort(sortStr);
    }

    return this;
  }
  limitfield() {
    if (this.queryStr.fields) {
      const fieldStr = this.queryStr.fields.split(',').join(' ');

      this.query = this.query.select(fieldStr);
    }
    return this;
  }
  paginate() {
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;

    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}
module.exports = APIFeatures;
