class apiFeatures {
  constructor(mongooseQuery, queryStr) {
    this.mongooseQuery = mongooseQuery;
    this.queryStr = queryStr;
  }

  filter() {
    //gte--> greater than or equal
    //lte-->less than or equal

    //1-filtering
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    const queryStringObj = { ...this.queryStr }; //هنا باخد نسخه من الكويري الاصليه واعدل فيها من غير م ابوظ الاصليه
    const exclude = ["page", "limit", "sort", "fields"];
    exclude.forEach((field) => delete queryStringObj[field]);

    //Apply filteration using[<= ,< , >= , >]
    //==>دي علشان نعرف نجيب المنتجات اللي سعرها ازيد من او يساوي 50 مثلا و هكذا
    let queryStr = JSON.stringify(queryStringObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      //=>عملناها كدا علشان نقدر نعمل سورت ب اكتر من حاجه ف نفس الوقت
      //=>علشان تفهم فعل الكونسول
      const sortBy = this.queryStr.sort.split(",").join(" ");
      //console.log(req.query.sort);
      //console.log(sortBy);
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt"); //بيجيب الاحدث
    }
    return this;
  }

  fieldChosen() {
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v ");
    }

    return this;
  }

  search(modelName) {
    if (this.queryStr.searchWord) {
      let query = {};
      if (modelName == "Product") {
        query.$or = [
          { title: { $regex: new RegExp(this.queryStr.searchWord, "i") } }, //=>كلمه ريجيكس دي معناها تحتوي علي و حرف الاي دا معناه انه يجيب الكلمه سواء كابيتال ولا سمول
          {
            description: { $regex: new RegExp(this.queryStr.searchWord, "i") },
          },
        ];
      } else {
        query = { name: { $regex: new RegExp(this.queryStr.searchWord, "i") } };
      }

      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }

  paginate(counter) {
    const page = this.queryStr.page * 1 || 1; //===>علشان استقبلها ف الموقع بدل م احطها من الكود
    const limit = this.queryStr.limit * 1 || 50;
    const skip = (page - 1) * limit;
    const lastIndexOfPage = page * limit;

    const pagenation = {};
    pagenation.currentPage = page;
    pagenation.limit = limit;

    ///full pages
    // 50->data limit->10  allpages = 50/10 -> 5
    pagenation.numOfpages = Math.ceil(counter / limit); //=>بنقرب الناتج

    //next page
    if (lastIndexOfPage < counter) {
      pagenation.nextPage = pagenation.currentPage + 1;
    }

    //prev page
    if (skip > 0) {
      pagenation.prevPage = pagenation.currentPage - 1;
    }
    this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);
    this.paginationResult = pagenation;
    return this;
  }
}

module.exports = apiFeatures;
