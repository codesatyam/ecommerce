class ApiFeature{
    constructor(query,querystr)
    {
        this.query=query;
        this.querystr=querystr;
    }
    search(){
     const keyword= this.querystr.keyword?
     {
       name:{
        $regex:this.querystr.keyword,
        $options:'i',
       }
     }:
     {

     }
     this.query= this.query.find({...keyword});
     return this;
    }
    filter(){
        const queryCopy={...this.querystr};

        // remove some field
        const removeField=["keyword","page","limit"];
        removeField.forEach((key)=> delete queryCopy[key]);

        let qrystr=JSON.stringify(queryCopy);
        qrystr=qrystr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`);
        this.query=this.query.find(JSON.parse(qrystr));
        // console.log(qrystr);
        return this;
    }
    pagination(resultpage){
    const currentPage=Number(this.querystr.page)|| 1;

    const skip=resultpage*(currentPage-1);

    this.query=this.query.limit(resultpage).skip(skip);
    return this;
    }
};

module.exports=ApiFeature;