class APIFeatures {
    constructor(query, queryStr){
        this.query = query
        this.queryStr = queryStr
         
    }
    search(){
        let keyword = this.queryStr.keyword ?{
            name:{
                $regex: this.queryStr.keyword,
                $options: 'i'
            }
        }:{}

        this.query = this.query.find({ ...keyword });
        return this
    }


    filter() {
        let queryStrCopy = { ...this.queryStr };
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field]);
    
       let queryStr  = JSON.stringify(queryStrCopy);
       queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
       console.log(queryStr)
       this.query =  this.query.find(JSON.parse(queryStr));
        return this;
    }
    

  // APIFeatures.js
paginate(resPerPage, page) {
    const skip = resPerPage * (page - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
}

}
   

module.exports = APIFeatures